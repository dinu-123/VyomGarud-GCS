# main.py - complete real-time backend with missions, auth, mavlink wiring
import asyncio
import io
import csv
import uuid
import json
import os
import time
from typing import Any, Dict, List, Optional

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Depends
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

# local modules (make sure these files exist in backend/app/)
import auth
import telemetry_sim as sim
import mission_engine
import mavlink_adapter
from data_store import read_drones, write_drones, read_flights, write_flights

app = FastAPI(title="VyomGarud GCS - Real-time Backend (full)")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # dev only; lock this down in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# runtime
_ws_clients: set[WebSocket] = set()
_drones_lock = asyncio.Lock()
_flights_lock = asyncio.Lock()

# ---------------------------------------------------------------------
# Helper: broadcast text to all connected WS clients
# ---------------------------------------------------------------------
async def broadcast_to_clients(text: str):
    dead = []
    for ws in list(_ws_clients):
        try:
            await ws.send_text(text)
        except Exception:
            dead.append(ws)
    for d in dead:
        _ws_clients.discard(d)


# ---------------------------------------------------------------------
# Startup: wire sim -> forward -> websocket + flight append callback, optional MAVLink
# ---------------------------------------------------------------------
@app.on_event("startup")
async def startup_event():
    # forward callback used by telemetry_sim to push messages to websockets
    async def forward_cb(text: str):
        # text is JSON string (telemetry)
        await broadcast_to_clients(text)

    sim.set_forward_callback(forward_cb)

    # wire mission_engine flight append (sim will call this frequently)
    # mission_engine.flight_append_point is a synchronous function that reads/writes flights via data_store
    sim.set_flight_append_callback(mission_engine.flight_append_point)

    # optional: start MAVLink listener if env variable provided
    mav_uri = os.environ.get("MAVLINK_URI")
    if mav_uri:
        # set a simple callback that prints or could convert mavlink->telemetry
        mavlink_adapter.set_mav_callback(lambda m: print("MAVLINK:", m))
        try:
            mavlink_adapter.start_mavlink_listener(mav_uri)
        except Exception as e:
            print("MAVLINK start error:", e)

    # start telemetry broadcaster background task
    # ensure only one task: create_task safe on reload
    asyncio.create_task(sim.telemetry_broadcaster())


# ---------------------------------------------------------------------
# Basic endpoints (health, login)
# ---------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok", "time": time.time()}


@app.post("/api/login")
async def login(payload: Dict[str, Any]):
    # demo: no credential check; returns JWT token
    token = auth.create_token("demo-user")
    return {"token": token, "company": "VyomGarud"}


# ---------------------------------------------------------------------
# Drones: use data_store read/write functions
# ---------------------------------------------------------------------
@app.get("/api/drones")
async def list_drones():
    async with _drones_lock:
        drones = read_drones()
        return JSONResponse(content=drones)


@app.get("/api/drones/{drone_id}")
async def drone_detail(drone_id: str):
    async with _drones_lock:
        drones = read_drones()
        for d in drones:
            if str(d.get("id")) == str(drone_id):
                return d
    raise HTTPException(status_code=404, detail="Drone not found")


# ---------------------------------------------------------------------
# Flights endpoints
# ---------------------------------------------------------------------
@app.get("/api/drones/{drone_id}/flights")
async def drone_flights(drone_id: str):
    async with _flights_lock:
        flights = read_flights()
        return [f for f in flights if str(f.get("drone_id")) == str(drone_id)]


@app.get("/api/flights/{flight_id}/report")
async def flight_report_csv(flight_id: str):
    async with _flights_lock:
        flights = read_flights()
        flight = next((f for f in flights if f.get("flight_id") == flight_id), None)
        if not flight:
            raise HTTPException(status_code=404, detail="Flight not found")
        path = flight.get("path", [])

    # stream CSV
    buffer = io.StringIO()
    writer = csv.writer(buffer)
    writer.writerow(["ts", "lat", "lon", "alt", "battery", "mode"])
    for p in path:
        writer.writerow([p.get("ts"), p.get("lat"), p.get("lon"), p.get("alt"), p.get("battery"), p.get("mode")])
    buffer.seek(0)
    return StreamingResponse(
        buffer,
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="flight_{flight_id}.csv"'}
    )


# ---------------------------------------------------------------------
# Takeoff / Land (modify drone status + create/close flight records)
# Protected endpoints: require token
# ---------------------------------------------------------------------
@app.post("/api/drones/{drone_id}/takeoff", dependencies=[Depends(auth.get_current_user)])
async def drone_takeoff(drone_id: str):
    # set drone status in store
    async with _drones_lock:
        drones = read_drones()
        drone = next((d for d in drones if str(d.get("id")) == str(drone_id)), None)
        if not drone:
            raise HTTPException(status_code=404, detail="Drone not found")
        drone["status"] = "in-air"
        write_drones(drones)

    # create flight
    flight_id = str(uuid.uuid4())
    flight = {
        "flight_id": flight_id,
        "drone_id": str(drone_id),
        "start_time": asyncio.get_event_loop().time(),
        "end_time": None,
        "path": []
    }
    async with _flights_lock:
        flights = read_flights()
        flights.append(flight)
        write_flights(flights)

    # update sim state (arm)
    try:
        sim.arm_drone(drone_id)
    except Exception:
        pass

    return {"message": "takeoff started", "flight": flight}


@app.post("/api/drones/{drone_id}/land", dependencies=[Depends(auth.get_current_user)])
async def drone_land(drone_id: str):
    # ensure drone exists
    async with _drones_lock:
        drones = read_drones()
        drone = next((d for d in drones if str(d.get("id")) == str(drone_id)), None)
        if not drone:
            raise HTTPException(status_code=404, detail="Drone not found")

    # close active flight
    async with _flights_lock:
        flights = read_flights()
        active = None
        for f in reversed(flights):
            if str(f.get("drone_id")) == str(drone_id) and f.get("end_time") is None:
                active = f
                break
        if not active:
            raise HTTPException(status_code=400, detail="No active flight found")
        active["end_time"] = asyncio.get_event_loop().time()
        write_flights(flights)

    async with _drones_lock:
        # set drone status to online
        drone["status"] = "online"
        write_drones(drones)

    # update sim (disarm)
    try:
        sim.disarm_drone(drone_id)
    except Exception:
        pass

    return {"message": "landed", "flight": active}


# ---------------------------------------------------------------------
# WEBSOCKET TELEMETRY: clients connect here to receive telemetry JSON
# ---------------------------------------------------------------------
@app.websocket("/ws/telemetry")
async def ws_telemetry(ws: WebSocket):
    await ws.accept()
    _ws_clients.add(ws)
    try:
        while True:
            try:
                data = await ws.receive_text()
            except WebSocketDisconnect:
                raise
            except Exception:
                # ignore transient read errors; keep connection open
                await asyncio.sleep(0.1)
                continue

            # keepalive / control
            if data == "ping":
                try:
                    await ws.send_text(json.dumps({"type": "pong"}))
                except Exception:
                    pass
    except WebSocketDisconnect:
        _ws_clients.discard(ws)
    except Exception:
        _ws_clients.discard(ws)
        raise


# ---------------------------------------------------------------------
# MISSION endpoints (upload / control)
# Protected via auth.get_current_user
# ---------------------------------------------------------------------
@app.post("/api/missions", dependencies=[Depends(auth.get_current_user)])
async def api_upload_mission(payload: Dict[str, Any]):
    m = await mission_engine.upload_mission(payload)
    return m


@app.get("/api/missions", dependencies=[Depends(auth.get_current_user)])
async def api_list_missions():
    return await mission_engine.list_missions()


@app.get("/api/missions/{mission_id}", dependencies=[Depends(auth.get_current_user)])
async def api_get_mission(mission_id: str):
    m = await mission_engine.get_mission(mission_id)
    if not m:
        raise HTTPException(status_code=404, detail="Mission not found")
    return m


@app.post("/api/missions/{mission_id}/start", dependencies=[Depends(auth.get_current_user)])
async def api_start_mission(mission_id: str):
    try:
        return await mission_engine.start_mission(mission_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Mission not found")
    except RuntimeError as e:
        raise HTTPException(status_code=400, detail=str(e))


@app.post("/api/missions/{mission_id}/pause", dependencies=[Depends(auth.get_current_user)])
async def api_pause_mission(mission_id: str):
    try:
        return await mission_engine.pause_mission(mission_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Mission not found")


@app.post("/api/missions/{mission_id}/resume", dependencies=[Depends(auth.get_current_user)])
async def api_resume_mission(mission_id: str):
    try:
        return await mission_engine.resume_mission(mission_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Mission not found")


@app.post("/api/missions/{mission_id}/cancel", dependencies=[Depends(auth.get_current_user)])
async def api_cancel_mission(mission_id: str):
    try:
        return await mission_engine.cancel_mission(mission_id)
    except KeyError:
        raise HTTPException(status_code=404, detail="Mission not found")


# ---------------------------------------------------------------------
# Wire telemetry sim + mission flight append function for safety if mission_engine exposes it
# (mission_engine.flight_append_point is a sync function we wired at startup above)
# ---------------------------------------------------------------------
# (Already wired during startup_event)

# ---------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------
if __name__ == "__main__":
    # Helpful debug info on startup
    print("Starting VyomGarud GCS backend...")
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=False)
