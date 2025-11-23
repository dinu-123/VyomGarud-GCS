# import json
# from pathlib import Path
# from typing import Any

# FILE = Path(__file__).with_name("data_store.json")

# def load() -> dict:
#     if not FILE.exists():
#         # initial default
#         default = {"drones": [], "flights": {}}
#         FILE.write_text(json.dumps(default))
#         return default
#     return json.loads(FILE.read_text())

# def save(state: dict) -> None:
#     # atomic-ish write (simple)
#     tmp = FILE.with_suffix(".tmp")
#     tmp.write_text(json.dumps(state))
#     tmp.replace(FILE)



# # store_persistence.py
# import json, os
# from typing import Any, Dict

# BASE_DIR = os.path.dirname(__file__)
# DATA_FILE = os.path.join(BASE_DIR, "data_store.json")

# def save_state(drones: Any, flights: Any) -> None:
#     payload = {"drones": drones, "flights": flights}
#     tmp = DATA_FILE + ".tmp"
#     with open(tmp, "w", encoding="utf-8") as f:
#         json.dump(payload, f, indent=2, ensure_ascii=False)
#     os.replace(tmp, DATA_FILE)

# def load_state() -> Dict[str, Any] | None:
#     if not os.path.exists(DATA_FILE):
#         return None
#     with open(DATA_FILE, "r", encoding="utf-8") as f:
#         return json.load(f)






import json
import os
from typing import Any, Dict

BASE_DIR = os.path.dirname(__file__)
DATA_FILE = os.path.join(BASE_DIR, "data_store.json")


def save_state(drones: Any, flights: Any) -> None:
    """Safely write drones + flights to JSON file."""
    payload = {"drones": drones, "flights": flights}
    tmp = DATA_FILE + ".tmp"
    with open(tmp, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    os.replace(tmp, DATA_FILE)


def load_state() -> Dict[str, Any] | None:
    """Load persisted state from JSON file if present."""
    if not os.path.exists(DATA_FILE):
        return None
    with open(DATA_FILE, "r", encoding="utf-8") as f:
        return json.load(f)
