from fastapi import FastAPI
from .api.v1.endpoints import tasks
from .middleware.jwt_middleware import JWTBearer
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

# Create FastAPI app instance
app = FastAPI(title="Task Management API", version="1.0.0")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("ALLOWED_ORIGINS", "*").split(","),
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(tasks.router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"message": "Task Management API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "task-management-api"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "src.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        reload=True
    )