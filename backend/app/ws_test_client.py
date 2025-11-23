# # ws_test_client.py
# import asyncio
# import websockets
# import json

# async def run():
#     uri = "ws://localhost:8000/ws/telemetry"
#     async with websockets.connect(uri) as ws:
#         print("connected")
#         # receive 10 messages then exit
#         for _ in range(20):
#             msg = await ws.recv()
#             data = json.loads(msg)
#             print(data)
#         await ws.send("ping")
#         pong = await ws.recv()
#         print("pong:", pong)

# asyncio.run(run())




# # ws_test_client.py
# import asyncio, websockets, json

# async def main():
#     uri = "ws://127.0.0.1:8000/ws/telemetry"
#     async with websockets.connect(uri) as ws:
#         print("connected")
#         for _ in range(10):
#             m = await ws.recv()
#             print("recv:", json.loads(m))
#         await ws.send("ping")
#         print("ping sent; waiting pong")
#         p = await ws.recv()
#         print("recv:", p)

# if __name__ == "__main__":
#     asyncio.run(main())



# # ws_test_client.py
# import asyncio
# import websockets

# async def main():
#     uri = "ws://127.0.0.1:8000/ws/telemetry"
#     try:
#         async with websockets.connect(uri) as ws:
#             print("Connected to", uri)
#             # start a receiver task
#             async def receiver():
#                 try:
#                     async for msg in ws:
#                         print("TELEM:", msg)
#                 except Exception as e:
#                     print("Receiver stopped:", e)

#             recv_task = asyncio.create_task(receiver())

#             # send periodic pings and keep client alive
#             for i in range(30):
#                 await ws.send("ping")
#                 await asyncio.sleep(1.0)

#             recv_task.cancel()
#     except Exception as e:
#         print("Connection failed:", e)

# if __name__ == "__main__":
#     asyncio.run(main())




# ws_test_client.py
import asyncio
import websockets
import json

URI = "ws://127.0.0.1:8000/ws/telemetry"

async def main():
    try:
        async with websockets.connect(URI) as ws:
            print("Connected to", URI)
            # send ping every 5s, print telemetry received
            async def recv():
                async for msg in ws:
                    print("RECV:", msg)

            async def ping():
                while True:
                    await ws.send("ping")
                    await asyncio.sleep(5)

            await asyncio.gather(recv(), ping())

    except Exception as e:
        print("WS error:", e)

if __name__ == "__main__":
    asyncio.run(main())
