from fastapi import APIRouter, HTTPException

from app.services.chat_service import cases
from app.services.rti_service import generate_rti
from app.services.case_validator import validate_case


router = APIRouter(
    prefix="/api/rti",
    tags=["RTI"]
)


@router.post("/draft")
def create_rti_draft(session_id: str):

    if session_id not in cases:
        raise HTTPException(
            status_code=404,
            detail="Session not found"
        )

    case = cases[session_id]

    if not case.get("ready_to_draft"):
        validation = validate_case(case)

        raise HTTPException(
            status_code=400,
            detail={
                "message": "Case does not contain enough information to generate an RTI.",
                "missing_fields": validation["missing_fields"]
            }
        )

    draft = generate_rti(case)

    return {
        "status": "success",
        "session_id": session_id,
        "draft": draft
    }