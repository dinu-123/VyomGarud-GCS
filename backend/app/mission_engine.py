# mission_engine.py
import asyncio
import uuid
from typing import Dict, Any, List, Optional
from data_store import read_flights, write_flights, read_drones, write_drones
import telemetry_sim as sim

# in-memory mission store
_MISSIONS: Dict[str, Dict[str, Any]] = {}
_missions_lock = asyncio.Lock()

# track active flight id per drone
_active_flight_for_drone: Dict[str, str] = {}

async def upload_mission(payload: Dict[str, Any]) -> Dict[str, Any]:
    """
    payload example:
    {
      "drone_id": "1",
      "name": "mission1",
      "waypoints": [{"lat":12.97,"lon":77.59,"alt":10}, ...]
    }
    """
    async with _missions_lock:
        mid = str(uuid.uuid4())
        m = {
            "mission_id": mid,
            "name": payload.get("name", "mission"),
            "drone_id": str(payload.get("drone_id", "1")),
            "waypoints": payload.get("waypoints", []),
            "created_at": asyncio.get_event_loop().time(),
            "status": "uploaded"
        }
        _MISSIONS[mid] = m
        return m

async def list_missions() -> List[Dict[str, Any]]:
    async with _missions_lock:
        return list(_MISSIONS.values())

async def get_mission(mission_id: str) -> Optional[Dict[str, Any]]:
    async with _missions_lock:
        return _MISSIONS.get(mission_id)

# mission control: start/pause/resume/cancel
async def start_mission(mission_id: str) -> Dict[str, Any]:
    async with _missions_lock:
        m = _MISSIONS.get(mission_id)
        if not m:
            raise KeyError("mission not found")
        if m.get("status") == "running":
            return m
        # tell sim about waypoints
        sim.set_mission(m["waypoints"])
        started = sim.start_mission()
        if not started:
            raise RuntimeError("mission could not be started (no waypoints?)")
        m["status"] = "running"
        m["started_at"] = asyncio.get_event_loop().time()
        return m

async def pause_mission(mission_id: str) -> Dict[str, Any]:
    async with _missions_lock:
        m = _MISSIONS.get(mission_id)
        if not m:
            raise KeyError("mission not found")
        sim.pause_mission()
        m["status"] = "paused"
        return m

async def resume_mission(mission_id: str) -> Dict[str, Any]:
    async with _missions_lock:
        m = _MISSIONS.get(mission_id)
        if not m:
            raise KeyError("mission not found")
        sim.resume_mission()
        m["status"] = "running"
        return m

async def cancel_mission(mission_id: str) -> Dict[str, Any]:
    async with _missions_lock:
        m = _MISSIONS.get(mission_id)
        if not m:
            raise KeyError("mission not found")
        sim.cancel_mission()
        m["status"] = "cancelled"
        m["cancelled_at"] = asyncio.get_event_loop().time()
        return m

# helper: append telemetry into currently active flight in file-store
# main will call set_flight_append_callback to wire this in.
def flight_append_point(point: Dict[str, Any]):
    """
    This function appends the telemetry point to the last active flight in data_store.
    It does a sync read/write. Called frequently by sim; keep it cheap.
    """
    try:
        flights = read_flights()
        if not flights:
            return
        # last flight is active if end_time is None
        last = flights[-1]
        if last.get("end_time") is None:
            path = last.get("path", [])
            path.append(point)
            last["path"] = path
            # write back
            write_flights(flights)
    except Exception:
        pass
