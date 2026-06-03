from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api.endpoints import auth

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

# Automated table generation on application boot
@app.on_event("startup")
async def on_startup():
    async with engine.begin() as conn:
        # This will create tables defined in Base (e.g. users table) if they do not exist
        await conn.run_sync(Base.metadata.create_all)

# Register API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication"])

@app.get("/")
async def root():
    return {
        "status": "online",
        "service": "Zoovita API",
        "docs_url": "/docs"
    }
