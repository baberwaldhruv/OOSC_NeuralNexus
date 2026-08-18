from app.ai.llm import generate_rti_draft


def generate_rti(case: dict) -> str:
    return generate_rti_draft(case)