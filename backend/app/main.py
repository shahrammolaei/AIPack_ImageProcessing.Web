from fastapi import FastAPI

app = FastAPI(
    title="AIPack Image Processing API",
    version="1.0.0",
)


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