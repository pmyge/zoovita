import os
import sys
import asyncio

# Add parent directory to sys path so we can import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from app.database import engine, Base
from app.models.user import User
from app.security import hash_password

async def create_superuser():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    async with AsyncSession(engine) as session:
        result = await session.execute(select(User).filter(User.phone == "admin"))
        admin_user = result.scalars().first()
        
        if admin_user:
            print("Superuser already exists.")
            admin_user.is_superuser = True
            admin_user.password_hash = hash_password("admin123")
            await session.commit()
            print("Superuser credentials updated.")
        else:
            admin_user = User(
                name="admin",
                phone="admin",
                email="admin@zoovita.uz",
                password_hash=hash_password("admin123"),
                is_superuser=True
            )
            session.add(admin_user)
            await session.commit()
            print("Superuser 'admin' created successfully.")

if __name__ == "__main__":
    asyncio.run(create_superuser())
