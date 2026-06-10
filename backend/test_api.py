import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy.future import select

async def main():
    req_email = "ergashmasharipov88@gmail.com"
    req_phone = "+998112223344"
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(User).filter(User.phone == req_phone, User.email == req_email))
        user = result.scalars().first()
        if user:
            print("FOUND")
        else:
            print("NOT FOUND")
asyncio.run(main())
