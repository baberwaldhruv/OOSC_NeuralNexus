from fastapi import APIRouter
from pydantic import BaseModel, Field
from app.services.rights_navigator_service import analyze_dispute

router = APIRouter(
    prefix="/api/rights-navigator",
    tags=["Rights Navigator"]
)

class DisputeAnalysisRequest(BaseModel):
    dispute_type: str = Field(..., example="Property dispute")
    description: str = Field(..., example="Landlord refusing to return security deposit.")
    location: str = Field(..., example="Jaipur, Rajasthan")

@router.get("/analyze")
def get_analyze_info():
    return {
        "status": "ready",
        "service": "Rights Navigator API",
        "description": "Send a POST request with dispute_type, description, and location in JSON format."
    }

@router.post("/analyze")
def analyze(payload: DisputeAnalysisRequest):
    result = analyze_dispute(
        dispute_type=payload.dispute_type,
        description=payload.description,
        location=payload.location
    )
    return {
        "success": True,
        "data": result
    }