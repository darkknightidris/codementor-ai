# backend/app/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.routers import review, profile, health


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("CodeMentor AI backend starting...")
    yield
    # Shutdown
    print("CodeMentor AI backend shutting down...")


app = FastAPI(
    title="CodeMentor AI API",
    version="1.0.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://codementor.ai",
        "https://www.codementor.ai",
        "http://localhost:3000",  # dev
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router)
app.include_router(review.router, prefix="/api")
app.include_router(profile.router, prefix="/api")
