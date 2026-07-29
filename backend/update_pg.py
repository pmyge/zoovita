import asyncio
import asyncpg
import os
from dotenv import load_dotenv

load_dotenv()

async def main():
    DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://zoovita_admin:admin123@localhost/zoovita")
    
    # asyncpg format for connection string is postgresql://user:pass@host/db
    # If the DATABASE_URL uses postgresql+asyncpg://, we need to replace it
    DATABASE_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    
    conn = await asyncpg.connect(DATABASE_URL)
    print("Connected to PostgreSQL")
    
    try:
        await conn.execute("ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_ru VARCHAR DEFAULT '';")
        print("Added name_ru")
        await conn.execute("ALTER TABLE categories ADD COLUMN IF NOT EXISTS name_en VARCHAR DEFAULT '';")
        print("Added name_en")
    except Exception as e:
        print(f"Error modifying database: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(main())
