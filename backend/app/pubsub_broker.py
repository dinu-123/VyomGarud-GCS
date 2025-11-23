# # pubsub_broker.py
# import asyncio
# from typing import Dict, List

# class InMemoryPubSub:
#     def __init__(self):
#         # channel -> list of asyncio.Queue
#         self._channels: Dict[str, List[asyncio.Queue]] = {}
#         self._lock = asyncio.Lock()

#     async def publish(self, channel: str, message: str):
#         async with self._lock:
#             queues = list(self._channels.get(channel, []))
#         for q in queues:
#             try:
#                 q.put_nowait(message)
#             except asyncio.QueueFull:
#                 pass

#     async def subscribe(self, channel: str, queue: asyncio.Queue):
#         async with self._lock:
#             self._channels.setdefault(channel, []).append(queue)

#     async def unsubscribe(self, channel: str, queue: asyncio.Queue):
#         async with self._lock:
#             if channel in self._channels and queue in self._channels[channel]:
#                 self._channels[channel].remove(queue)
#                 if not self._channels[channel]:
#                     del self._channels[channel]



# pubsub_broker.py
import asyncio
from typing import Dict, Set, Any


class InMemoryPubSub:
    """
    Very small in-memory pubsub. subscribe(channel, asyncio.Queue),
    publish(channel, msg) will put msg into all subscribed queues.
    """

    def __init__(self):
        self._channels: Dict[str, Set[asyncio.Queue]] = {}
        self._lock = asyncio.Lock()

    async def subscribe(self, channel: str, queue: asyncio.Queue) -> None:
        async with self._lock:
            self._channels.setdefault(channel, set()).add(queue)

    async def unsubscribe(self, channel: str, queue: asyncio.Queue) -> None:
        async with self._lock:
            s = self._channels.get(channel)
            if not s:
                return
            s.discard(queue)
            if not s:
                self._channels.pop(channel, None)

    async def publish(self, channel: str, message: Any) -> None:
        async with self._lock:
            queues = list(self._channels.get(channel, ()))
        # publish without holding lock
        for q in queues:
            # do not await here so publisher is not blocked by slow consumers
            try:
                q.put_nowait(message)
            except asyncio.QueueFull:
                # if queue is full, drop message for that subscriber
                pass
