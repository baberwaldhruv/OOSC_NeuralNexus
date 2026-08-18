from fastapi import FastAPI

from app.api.routes.chat import router as chat_router
from app.api.routes.rti import router as rti_router


app = FastAPI(
    title="Vakilai",
    description="AI-powered civic rights and government assistance system",
    version="0.1.0"
)


app.include_router(chat_router)
app.include_router(rti_router)


@app.get("/health")
def health_check():
    return {
        "status": "healthy"
    }