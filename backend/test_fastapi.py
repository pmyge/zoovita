import asyncio
import json
import httpx

async def main():
    async with httpx.AsyncClient() as client:
        response = await client.post(
            "http://127.0.0.1:8000/api/v1/auth/forgot-password",
            json={"email": "ergashmasharipov88@gmail.com", "phone": "+998112223344"}
        )
        print(response.json())

asyncio.run(main())
