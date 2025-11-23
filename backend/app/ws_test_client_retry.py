# ws_test_client_retry.py
import asyncio
import websockets
import time

URI = "ws://127.0.0.1:8000/ws/telemetry"
RETRIES = 6
BACKOFF = 1.0

async def run_client():
    for attempt in range(1, RETRIES + 1):
        try:
            print(f"[{time.strftime('%H:%M:%S')}] Trying connect (attempt {attempt}) -> {URI}")
            async with websockets.connect(URI) as ws:
                print("[OK] Connected to", URI)
                # send a ping to the server (your server expects text "ping")
                try:
                    await ws.send("ping")
                    print("Sent: ping")
                except Exception as e:
                    print("Send error:", e)
                # receive messages (telemetry broadcasts)
                while True:
                    msg = await ws.recv()
                    print("RECV:", msg)
        except ConnectionRefusedError as e:
            print("[WS error] ConnectionRefusedError:", e)
        except OSError as e:
            print("[WS error] OSError:", e)
        except Exception as e:
            print("[WS error] Exception:", type(e).__name__, e)
        wait = BACKOFF * attempt
        print(f"Waiting {wait:.1f}s before retry...")
        await asyncio.sleep(wait)
    print("All attempts failed.")

if __name__ == "__main__":
    try:
        asyncio.run(run_client())
    except KeyboardInterrupt:
        print("Client stopped by user.")
