from typing import Optional
from pydantic import BaseModel


class CaseModel(BaseModel):
    issue: Optional[str] = None
    village: Optional[str] = None
    city: Optional[str] = None
    district: Optional[str] = None
    state: Optional[str] = None
    department: Optional[str] = None
    information_requested: Optional[str] = None
    project_details: Optional[str] = None
    applicant_name: Optional[str] = None
    applicant_address: Optional[str] = None
    ready_to_draft: bool = False


class ChatResponse(BaseModel):
    status: str
    session_id: str
    response: str
    case: CaseModel
    missing_fields: list[str]


class RTIDraftResponse(BaseModel):
    status: str
    session_id: str
    draft: str