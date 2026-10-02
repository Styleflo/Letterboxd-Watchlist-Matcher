import logging
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import movies

# Configure logging system
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Letterboxd-App API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(movies.router)


@app.get("/api/health")
async def health_check():
  logger.info("Health check endpoint accessed.")
  return {
      "status": "ok",
      "message": "FastAPI backend is running successfully on Vercel",
  }
