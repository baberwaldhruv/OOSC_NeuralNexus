from fastapi import APIRouter, HTTPException
from app.services.scheme_service import check_scheme_eligibility

router = APIRouter(prefix="/api/scheme", tags=["Scheme Eligibility Reader"])

@router.post("/check-eligibility")
def evaluate_eligibility(payload: dict):
    user_query = payload.get("user_query", "").strip()
    scheme_context = payload.get("scheme_context", "").strip()

    if not user_query:
        raise HTTPException(
            status_code=400,
            detail="Missing required field: 'user_query'"
        )

    result = check_scheme_eligibility(
        user_query=user_query,
        scheme_context=scheme_context
    )

    return {
        "success": True,
        "result": result
    }