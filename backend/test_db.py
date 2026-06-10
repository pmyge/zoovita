import asyncio
from app.database import AsyncSessionLocal
from app.models.user import User
from sqlalchemy.future import select
from sqlalchemy import func

async def main():
    async with AsyncSessionLocal() as db:
        email_clean = "ergashmasharipov88@gmail.com"
        result = await db.execute(select(User).filter(func.lower(User.email) == email_clean))
        user = result.scalars().first()
        if user:
            print(f"FOUND: {user.email}")
        else:
            print("NOT FOUND")
            # Let's print all emails
            res = await db.execute(select(User))
            for u in res.scalars().all():
                print(f"DB EMAIL: '{u.email}'")

asyncio.run(main())
