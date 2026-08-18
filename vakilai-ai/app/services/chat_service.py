from app.ai.llm import generate_response, extract_case
from app.services.case_service import create_case, update_case
from app.services.case_validator import validate_case


sessions = {}
cases = {}


def chat(session_id: str, message: str):

    if session_id not in sessions:
        sessions[session_id] = []
        cases[session_id] = create_case()

    sessions[session_id].append({
        "role": "user",
        "content": message
    })

    extracted_data = extract_case(
        sessions[session_id]
    )

    cases[session_id] = update_case(
        cases[session_id],
        extracted_data
    )

    validation = validate_case(
        cases[session_id]
    )

    cases[session_id]["ready_to_draft"] = (
        validation["ready_to_draft"]
    )

    response = generate_response(
    sessions[session_id],
    validation["missing_fields"]
    )

    sessions[session_id].append({
        "role": "assistant",
        "content": response
    })

    return {
        "response": response,
        "case": cases[session_id],
        "missing_fields": validation["missing_fields"]
    }