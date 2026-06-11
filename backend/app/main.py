from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import auth
from app.models.telegram_session import TelegramSession
from app.models.banner import Banner
from app.models.category import Category
from app.models.ad import Ad
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
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all HTTP headers
)

from app.bot import start_bot
import asyncio

# Automated table generation on application boot
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # This will create tables defined in Base (e.g. users table) if they do not exist
        await conn.run_sync(Base.metadata.create_all)
    
    # Start the Telegram bot in the background
    asyncio.create_task(start_bot())

from app.api.endpoints import auth, admin, ads, chats

os.makedirs("uploads/banners", exist_ok=True)
os.makedirs("uploads/categories", exist_ok=True)
os.makedirs("uploads/ads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# Register API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(admin.router, prefix="/api/v1/admin", tags=["Admin"])
app.include_router(ads.router, prefix="/api/v1/ads", tags=["Ads"])
app.include_router(chats.router, prefix="/api/v1/chats", tags=["Chats"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Zoovita API",
        "docs_url": "/docs"
    }
