# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",
#         "battery": 98,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# FLIGHTS = {
#     "1": []
# }



# # data_store.py
# # In-memory demo datastore for drones and flights

# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",
#         "battery": 98,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# # FLIGHTS is a list of flight records.
# # Each flight: { "flight_id": ..., "drone_id": ..., "start_time": ..., "end_time": ..., "path": [...] }
# FLIGHTS = []




# # data_store.py
# # Simple in-memory store used by the sim backend.

# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",   # "online" or "in-air"
#         "battery": 98.0,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# # FLIGHTS is a list of flight records (so we can append / search)
# # Each flight is a dict like:
# # {
# #   "flight_id": "...",
# #   "drone_id": "1",
# #   "start_time": 123.123,
# #   "end_time": None,
# #   "path": [ { "ts": ..., "lat": ..., "lon": ..., "alt": ... }, ... ]
# # }
# FLIGHTS = []




# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",
#         "battery": 98.0,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# # FLIGHTS is a list of flight dicts; each flight has flight_id, drone_id, path, etc.
# FLIGHTS = []




# # data_store.py
# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",
#         "battery": 98.0,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# # FLIGHTS as a list of flight dicts
# FLIGHTS = []




# # data_store.py
# import json
# import os
# import threading
# from typing import List, Dict, Any

# _LOCK = threading.Lock()
# DATA_FILE = os.path.join(os.path.dirname(__file__), "data_store.json")

# # default content
# _default = {
#     "drones": [
#         {
#             "id": "1",
#             "name": "VyomGarud Demo Drone",
#             "status": "online",
#             "battery": 98.0,
#             "lat": 12.9716,
#             "lon": 77.5946,
#             "alt": 0
#         }
#     ],
#     "flights": []
# }


# def _load() -> Dict[str, Any]:
#     if not os.path.exists(DATA_FILE):
#         _save(_default)
#         return dict(_default)
#     with open(DATA_FILE, "r", encoding="utf-8") as f:
#         try:
#             return json.load(f)
#         except Exception:
#             # broken file -> reset to default
#             _save(_default)
#             return dict(_default)


# def _save(data: Dict[str, Any]) -> None:
#     tmp = DATA_FILE + ".tmp"
#     with open(tmp, "w", encoding="utf-8") as f:
#         json.dump(data, f, indent=2)
#     os.replace(tmp, DATA_FILE)


# def read_drones() -> List[Dict[str, Any]]:
#     with _LOCK:
#         data = _load()
#         return data.get("drones", [])


# def write_drones(drones: List[Dict[str, Any]]) -> None:
#     with _LOCK:
#         data = _load()
#         data["drones"] = drones
#         _save(data)


# def read_flights() -> List[Dict[str, Any]]:
#     with _LOCK:
#         data = _load()
#         return data.get("flights", [])


# def write_flights(flights: List[Dict[str, Any]]) -> None:
#     with _LOCK:
#         data = _load()
#         data["flights"] = flights
#         _save(data)




# data_store.py
# Simple in-memory data store for the GCS backend.

# DRONES = [
#     {
#         "id": "1",
#         "name": "VyomGarud Demo Drone",
#         "status": "online",      # "online" or "in-air"
#         "battery": 98.0,
#         "lat": 12.9716,
#         "lon": 77.5946,
#         "alt": 0
#     }
# ]

# # FLIGHTS is a list of flight dicts.
# # Each flight has: flight_id, drone_id, start_time, end_time, path
# FLIGHTS = []



# data_store.py
import json
import os
import threading
from typing import List, Dict, Any

_LOCK = threading.Lock()
DATA_FILE = os.path.join(os.path.dirname(__file__), "data_store.json")

# default content
_default = {
    "drones": [
        {
            "id": "1",
            "name": "VyomGarud Demo Drone",
            "status": "online",
            "battery": 98.0,
            "lat": 12.9716,
            "lon": 77.5946,
            "alt": 0.0
        }
    ],
    "flights": []
}


def _load() -> Dict[str, Any]:
    """
    Load JSON from DATA_FILE. If file missing or broken, write defaults and return defaults.
    """
    if not os.path.exists(DATA_FILE):
        _save(_default)
        return dict(_default)
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        try:
            return json.load(f)
        except Exception:
            # broken file -> reset to default
            _save(_default)
            return dict(_default)


def _save(data: Dict[str, Any]) -> None:
    """
    Write JSON atomically using a .tmp file and replace.
    """
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)
    os.replace(tmp, DATA_FILE)


def read_drones() -> List[Dict[str, Any]]:
    with _LOCK:
        data = _load()
        return data.get("drones", [])


def write_drones(drones: List[Dict[str, Any]]) -> None:
    with _LOCK:
        data = _load()
        data["drones"] = drones
        _save(data)


def read_flights() -> List[Dict[str, Any]]:
    with _LOCK:
        data = _load()
        return data.get("flights", [])


def write_flights(flights: List[Dict[str, Any]]) -> None:
    with _LOCK:
        data = _load()
        data["flights"] = flights
        _save(data)
