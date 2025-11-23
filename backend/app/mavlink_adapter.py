# mavlink_adapter.py
import asyncio
import threading
from typing import Optional, Callable
import json

# If user installed pymavlink, we can parse real MAVLink messages.
try:
    from pymavlink import mavutil
    _HAS_PYMAVLINK = True
except Exception:
    _HAS_PYMAVLINK = False

_mav_callback = None  # callable(msg_dict)

def set_mav_callback(cb: Callable[[dict], None]):
    global _mav_callback
    _mav_callback = cb

def process_mavlink_msg_dict(d: dict):
    """Convert mavlink dict into internal telemetry and call callback if set."""
    if _mav_callback:
        try:
            _mav_callback(d)
        except Exception:
            pass

def start_mavlink_listener(uri: str):
    """
    uri examples:
      - 'udp:127.0.0.1:14550'  (SITL)
      - 'tcp:0.0.0.0:5760'
      - 'serial:/dev/ttyUSB0:57600'
    This runs in a background thread.
    """
    if not _HAS_PYMAVLINK:
        print("pymavlink not installed; mavlink listener disabled.")
        return

    def run():
        try:
            m = mavutil.mavlink_connection(uri)
            while True:
                msg = m.recv_match(blocking=True, timeout=1)
                if msg is None:
                    continue
                # convert fields to dict (simple)
                md = {k: getattr(msg, k) for k in msg._fieldnames}
                process_mavlink_msg_dict(md)
        except Exception as e:
            print("MAVLink listener stopped:", e)

    t = threading.Thread(target=run, daemon=True)
    t.start()
