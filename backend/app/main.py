from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.features.image.presentation.image_api import router as image_router
from app.features.video.presentation.video_api import router as video_router


app = FastAPI(
    title="AIPack Image Processing API",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(image_router)
app.include_router(video_router)


@app.get("/")
def root():
    return {
        "message": "AIPack Image Processing API is running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }