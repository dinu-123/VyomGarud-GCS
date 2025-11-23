# missions.py — Realistic Mission Execution Engine (VyomGarud GCS)

import asyncio
import math
import time
from typing import List, Dict, Optional, Callable, Awaitable

import data_store

# TELEMETRY REFERENCE (comes from telemetry_sim.py)
_TELEM = None

# WebSocket broadcast hook (optional)
_broadcast_hook: Optional[Callable[[str], Awaitable[None]]] = None

# Mission storage
_mission: List[Dict] = []
_mission_loaded = False

# Mission control state
_running = False
_paused = False
_cancel = False


# -------------------------------------------------------------
# INIT HOOKS
# -------------------------------------------------------------
def set_telemetry_ref(ref: Dict[str, float]):
    """main.py passes SIM_TELEMETRY dict so we can read/write it live."""
    global _TELEM
    _TELEM = ref


def set_broadcast_hook(cb):
    """Used to broadcast mission events to frontend."""
    global _broadcast_hook
    _broadcast_hook = cb


# -------------------------------------------------------------
# MISSION MANAGEMENT
# -------------------------------------------------------------
def upload(payload: Dict[str, List[Dict]]):
    """
    payload = {
        "waypoints": [
            { "lat": float, "lon": float, "alt": float },
            ...
        ]
    }
    """
    global _mission, _mission_loaded, _running, _paused, _cancel

    if "waypoints" not in payload:
        raise ValueError("Missing waypoints")

    if len(payload["waypoints"]) == 0:
        raise ValueError("No waypoints provided")

    _mission = payload["waypoints"]
    _mission_loaded = True
    _running = False
    _paused = False
    _cancel = False

    return True


def is_loaded() -> bool:
    return _mission_loaded


def pause():
    global _paused
    _paused = True


def resume():
    global _paused
    _paused = False


def cancel():
    global _cancel, _running
    _cancel = True
    _running = False


# -------------------------------------------------------------
# MISSION ENGINE
# -------------------------------------------------------------
async def start():
    """
    Executes mission waypoint-by-waypoint.
    Smooth movement, altitude control, realistic trajectory.
    Saves points to flight log.
    """
    global _running, _paused, _cancel

    if not _mission_loaded:
        return

    _running = True
    _paused = False
    _cancel = False

    # Get active flight for logging
    flights = data_store.read_flights()
    active = None
    for f in reversed(flights):
        if f["end_time"] is None:
            active = f
            break

    # If no active flight, missions still run but won't be logged
    if active is None:
        print("WARNING: Mission running without a flight log.")
        active = None

    # EXECUTE WAYPOINTS
    for wp in _mission:
        if _cancel:
            break
        await _move_to_waypoint(wp, active)

    _running = False
    _paused = False

    # Optionally broadcast mission completion
    if _broadcast_hook:
        await _broadcast_hook('{"event":"mission_completed"}')


# -------------------------------------------------------------
# MOVE TO WAYPOINT
# -------------------------------------------------------------
async def _move_to_waypoint(wp: Dict, active_flight):
    """Smoothly move drone to a target waypoint."""

    target_lat = wp["lat"]
    target_lon = wp["lon"]
    target_alt = wp["alt"]

    # Movement parameters
    horizontal_speed = 8.0   # m/s
    vertical_speed = 2.5     # m/s
    update_rate = 0.30       # seconds

    while True:
        if _cancel:
            return

        # Pause
        while _paused:
            await asyncio.sleep(0.3)
            if _cancel:
                return

        # Current pos
        lat = _TELEM["lat"]
        lon = _TELEM["lon"]
        alt = _TELEM["alt"]

        # Distance left
        d = _distance_m(lat, lon, target_lat, target_lon)
        dz = target_alt - alt

        # Close enough → reached waypoint
        if d < 0.5 and abs(dz) < 0.5:
            break

        # Horizontal movement
        if d > 0.1:
            direction = math.atan2(target_lon - lon, target_lat - lat)
            dlat = math.cos(direction) * (horizontal_speed * update_rate) * 0.0000089
            dlon = math.sin(direction) * (horizontal_speed * update_rate) * 0.0000089
            lat += dlat
            lon += dlon

        # Vertical movement
        if abs(dz) > 0.2:
            if dz > 0:
                alt += vertical_speed * update_rate
            else:
                alt -= vertical_speed * update_rate

        # Apply
        _TELEM["lat"] = lat
        _TELEM["lon"] = lon
        _TELEM["alt"] = max(0, alt)
        _TELEM["mode"] = "MISSION"
        _TELEM["ts"] = time.time()

        # Log point to flight
        if active_flight:
            _append_to_flight(active_flight, _TELEM)

        await asyncio.sleep(update_rate)


# -------------------------------------------------------------
# FLIGHT LOGGING
# -------------------------------------------------------------
def _append_to_flight(flight, telem):
    flights = data_store.read_flights()

    for f in flights:
        if f["flight_id"] == flight["flight_id"]:
            f["path"].append({
                "ts": telem["ts"],
                "lat": telem["lat"],
                "lon": telem["lon"],
                "alt": telem["alt"],
                "battery": telem["battery"]
            })
            data_store.write_flights(flights)
            return


# -------------------------------------------------------------
# UTIL — Distance in meters
# -------------------------------------------------------------
def _distance_m(lat1, lon1, lat2, lon2):
    return math.sqrt(
        ((lat2 - lat1) * 111320) ** 2 +
        ((lon2 - lon1) * 111320) ** 2
    )
