from fastapi import APIRouter

from app.services.chat_service import chat as chat_service
from app.models.rti_model import ChatResponse


router = APIRouter(
    prefix="/api/chat",
    tags=["Chat"]
)


@router.post("/", response_model=ChatResponse)
def chat(session_id: str, message: str):

    result = chat_service(
        session_id,
        message
    )

    return {
        "status": "success",
        "session_id": session_id,
        "response": result["response"],
        "case": result["case"],
        "missing_fields": result["missing_fields"]
    }