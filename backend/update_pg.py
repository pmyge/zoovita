import asyncio
import os
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy import text

load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://zoovita_admin:admin123@localhost/zoovita")

async def update_db():
    engine = create_async_engine(DATABASE_URL)
    async with engine.begin() as conn:
        try:
            await conn.execute(text("ALTER TABLE ads ADD COLUMN telegram_message_id VARCHAR;"))
            print("Database updated successfully!")
        except Exception as e:
            if "duplicate column" in str(e).lower() or "already exists" in str(e).lower() or "column \"telegram_message_id\" of relation \"ads\" already exists" in str(e):
                print("Column already exists!")
            else:
                print(f"Error: {e}")
    await engine.dispose()

if __name__ == "__main__":
    asyncio.run(update_db())
