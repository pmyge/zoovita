from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import auth
from app.models.telegram_session import TelegramSession
from app.models.banner import Banner
from app.models.category import Category
from app.models.ad import Ad
from app.models.address import Address
from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="Zoovita API",
    description="Python FastAPI Backend for Zoovita Mobile App and Admin Panel",
    version="1.0.0"
)

# Set up CORS middleware to allow connection from Mobile Expo Apps
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=False,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

from app.bot import start_bot
import asyncio

# Automated table generation on application boot
@app.on_event("startup")
async def on_startup():
    # 1. Create all tables first in a dedicated transaction
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        
    # 2. Upgrade schema dynamically for ads table, catching expected errors individually
    import sqlalchemy
    columns_to_add = [
        "gender", "age", "breed", "health", "milk_yield", 
        "weight", "vaccinated", "service_type", "experience", "volume"
    ]
    for col in columns_to_add:
        try:
            async with engine.begin() as conn:
                await conn.execute(sqlalchemy.text(f"ALTER TABLE ads ADD COLUMN {col} VARCHAR"))
        except Exception:
            pass # Column already exists
            
    # 3. Ensure addresses table exists in PostgreSQL in its own transaction
    try:
        async with engine.begin() as conn:
            await conn.execute(sqlalchemy.text("""
                CREATE TABLE IF NOT EXISTS addresses (
                    id SERIAL PRIMARY KEY,
                    user_id INTEGER REFERENCES users(id),
                    title VARCHAR,
                    address_text VARCHAR,
                    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
                )
            """))
            await conn.execute(sqlalchemy.text("""
                CREATE INDEX IF NOT EXISTS ix_addresses_id ON addresses (id)
            """))
    except Exception as e:
        print(f"Error creating addresses table: {e}")
    
    # Start the Telegram bot in the background
    asyncio.create_task(start_bot())

from app.api.endpoints import auth, admin, ads, chats, notifications

os.makedirs("uploads/banners", exist_ok=True)
os.makedirs("uploads/categories", exist_ok=True)
os.makedirs("uploads/ads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(ads.router, prefix="/api/v1/ads", tags=["Ads"])
app.include_router(chats.router, prefix="/api/v1/chats", tags=["Chats"])
app.include_router(notifications.router, prefix="/api/v1/notifications", tags=["Notifications"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Zoovita API",
        "docs_url": "/docs"
    }
