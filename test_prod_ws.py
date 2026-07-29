import asyncio
import websockets

async def test():
    uri = "wss://api.zoovita.uz/api/v1/chats/ws/test_token"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected!")
    except Exception as e:
        print(f"Failed: {e}")

asyncio.run(test())
