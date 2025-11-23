# telemetry_sim.py
import asyncio
import time
from typing import Callable, Awaitable, Optional, Dict, List
import math
import json

# callables set by main
_forward_callback: Optional[Callable[[str], Awaitable[None]]] = None
_flight_append_callback: Optional[Callable[[dict], None]] = None

def set_forward_callback(cb: Callable[[str], Awaitable[None]]):
    global _forward_callback
    _forward_callback = cb

def set_flight_append_callback(cb: Callable[[dict], None]):
    """Main can provide a sync callback to record telemetry points to flights."""
    global _flight_append_callback
    _flight_append_callback = cb

# simulation state
SIM_STATE: Dict[str, float] = {
    "lat": 12.9716,
    "lon": 77.5946,
    "alt": 0.0,
    "battery": 98.0,
    "h_speed": 0.0,
    "v_speed": 0.0,
    "mode": "IDLE",
    "ts": time.time()
}

_takeoff_active = False
_land_active = False

# mission state
_mission_waypoints: List[Dict[str, float]] = []
_mission_index = 0
_mission_active = False
_mission_paused = False
_mission_speed_m_s = 5.0  # horizontal speed used while following mission

# controller helpers
def arm_drone(drone_id: str):
    global _takeoff_active, _land_active
    _takeoff_active = True
    _land_active = False
    SIM_STATE["mode"] = "TAKEOFF"
    SIM_STATE["v_speed"] = 1.8

def disarm_drone(drone_id: str):
    global _takeoff_active, _land_active, _mission_active, _mission_waypoints, _mission_index
    _takeoff_active = False
    _land_active = True
    SIM_STATE["mode"] = "LAND"
    SIM_STATE["v_speed"] = -1.6
    # stop mission when landing
    _mission_active = False
    _mission_waypoints = []
    _mission_index = 0

def set_mission(waypoints: List[Dict[str, float]]):
    """Replace mission waypoints. Each waypoint: {'lat':..., 'lon':..., 'alt':...}"""
    global _mission_waypoints, _mission_index, _mission_active, _mission_paused
    _mission_waypoints = list(waypoints)
    _mission_index = 0
    _mission_active = False
    _mission_paused = False

def start_mission():
    global _mission_active, _mission_index, _mission_paused
    if not _mission_waypoints:
        return False
    _mission_index = 0
    _mission_active = True
    _mission_paused = False
    SIM_STATE["mode"] = "MISSION"
    return True

def pause_mission():
    global _mission_paused
    _mission_paused = True
    SIM_STATE["mode"] = "PAUSED"

def resume_mission():
    global _mission_paused
    _mission_paused = False
    SIM_STATE["mode"] = "MISSION"

def cancel_mission():
    global _mission_active, _mission_waypoints, _mission_index, _mission_paused
    _mission_active = False
    _mission_waypoints = []
    _mission_index = 0
    _mission_paused = False
    SIM_STATE["mode"] = "IDLE"

# internal math
def _haversine_meters(lat1, lon1, lat2, lon2):
    R = 6371000.0
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = math.sin(dphi/2)**2 + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda/2)**2
    return 2 * R * math.asin(math.sqrt(a))

def _step_towards(lat1, lon1, lat2, lon2, step_m):
    dist = _haversine_meters(lat1, lon1, lat2, lon2)
    if dist <= 0.0001 or step_m <= 0:
        return lat2, lon2
    frac = min(1.0, step_m / dist)
    # simple linear interpolation on lat/lon is OK for small distances
    newlat = lat1 + (lat2 - lat1) * frac
    newlon = lon1 + (lon2 - lon1) * frac
    return newlat, newlon

async def telemetry_broadcaster():
    global SIM_STATE, _mission_active, _mission_index, _takeoff_active, _land_active
    LOOP_INTERVAL = 0.25
    while True:
        now = time.time()
        SIM_STATE["ts"] = now

        # battery drain
        SIM_STATE["battery"] = max(0.0, SIM_STATE["battery"] - 0.01 * LOOP_INTERVAL * 2)

        # takeoff / land vertical
        if _takeoff_active:
            SIM_STATE["alt"] = min(50.0, SIM_STATE["alt"] + SIM_STATE["v_speed"] * LOOP_INTERVAL)
        elif _land_active:
            SIM_STATE["alt"] = max(0.0, SIM_STATE["alt"] + SIM_STATE["v_speed"] * LOOP_INTERVAL)

        # mission following
        if _mission_active and not _mission_paused and _mission_waypoints:
            wp = _mission_waypoints[_mission_index]
            target_lat = wp.get("lat", SIM_STATE["lat"])
            target_lon = wp.get("lon", SIM_STATE["lon"])
            target_alt = wp.get("alt", SIM_STATE["alt"])
            # move horizontally toward waypoint at mission speed
            step_m = _mission_speed_m_s * LOOP_INTERVAL
            newlat, newlon = _step_towards(SIM_STATE["lat"], SIM_STATE["lon"], target_lat, target_lon, step_m)
            SIM_STATE["h_speed"] = _mission_speed_m_s
            SIM_STATE["lat"] = newlat
            SIM_STATE["lon"] = newlon
            # altitude approach simple
            if abs(SIM_STATE["alt"] - target_alt) > 0.25:
                SIM_STATE["v_speed"] = 1.0 if target_alt > SIM_STATE["alt"] else -1.0
                SIM_STATE["alt"] += SIM_STATE["v_speed"] * LOOP_INTERVAL
            else:
                SIM_STATE["v_speed"] = 0.0
            # check reached waypoint (within 1 meter horizontally)
            if _haversine_meters(SIM_STATE["lat"], SIM_STATE["lon"], target_lat, target_lon) < 1.0:
                # next wp
                _mission_index += 1
                if _mission_index >= len(_mission_waypoints):
                    # mission finished
                    _mission_active = False
                    SIM_STATE["mode"] = "MISSION_DONE"
        else:
            # small drift
            SIM_STATE["h_speed"] = 0.0
            SIM_STATE["v_speed"] = 0.0

        # add telemetry point to flight path if a flight is active: main must provide callback
        point = {
            "ts": SIM_STATE["ts"],
            "lat": SIM_STATE["lat"],
            "lon": SIM_STATE["lon"],
            "alt": round(SIM_STATE["alt"], 3),
            "battery": round(SIM_STATE["battery"], 3),
            "mode": SIM_STATE["mode"]
        }
        if _flight_append_callback:
            try:
                _flight_append_callback(point)
            except Exception:
                pass

        # forward JSON string to WS
        if _forward_callback:
            try:
                await _forward_callback(json.dumps({"type": "telemetry", **point}))
            except Exception:
                pass

        await asyncio.sleep(LOOP_INTERVAL)
