import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings

# Import Routers
from app.routes.analytics import router as analytics_router
from app.routes.prediction import router as prediction_router
from app.routes.simulator import router as simulator_router
from app.routes.analyst import router as analyst_router
from app.routes.live import router as live_router
from app.routes.war_room import router as war_room_router

app = FastAPI(
    title="CricketIQ API",
    description="Advanced AI Cricket Analytics and Intelligence Platform Engine",
    version="1.0.0"
)

# CORS Configuration for frontend communication
# Vite React app runs on http://localhost:5173 by default
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:5174",
        "*" # Fallback allow for general developer setups
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Modular API Routers
app.include_router(analytics_router, prefix="/api")
app.include_router(prediction_router, prefix="/api")
app.include_router(simulator_router, prefix="/api")
app.include_router(analyst_router, prefix="/api")
app.include_router(live_router, prefix="/api")
app.include_router(war_room_router, prefix="/api")

@app.get("/")
async def root():
    return {
        "status": "healthy",
        "project": "CricketIQ AI Intelligence Platform",
        "docs_url": "/docs",
        "version": "1.0.0"
    }

@app.get("/api/health")
async def health_check():
    return {
        "status": "online",
        "api_services": "active",
        "gemini_integration": "initialized"
    }

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True
    )
