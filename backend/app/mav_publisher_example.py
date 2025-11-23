# mav_publisher_example.py  (concept)
import asyncio
import json
import os
from redis import asyncio as aioredis
# from mavsdk import System  # uncomment if installed

REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379/0")
CHANNEL = "telemetry"

async def publish_loop():
    r = aioredis.from_url(REDIS_URL, decode_responses=True)
    try:
        # connect to drone (example; adapt per mavsdk doc)
        # drone = System()
        # await drone.connect(system_address="udp://:14540")
        # async for telemetry in drone.telemetry.position():
        #     ... build payload and publish ...
        # For illustration we use a dummy loop
        while True:
            msg = {
                "type": "telemetry",
                "payload": {
                    "drone_id": "1",
                    "lat": 12.9716,
                    "lon": 77.5946,
                    "alt": 10,
                    "battery": 90.0,
                    "mode": "GUIDED",
                    "ts": asyncio.get_event_loop().time()
                }
            }
            await r.publish(CHANNEL, json.dumps(msg))
            await asyncio.sleep(0.5)
    finally:
        await r.close()

if __name__ == "__main__":
    asyncio.run(publish_loop())
