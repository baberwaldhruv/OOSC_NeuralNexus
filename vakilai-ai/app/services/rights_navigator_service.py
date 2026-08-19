from app.ai.llm import generate_text_response
from app.ai.prompts.rights_navigater_promt import RIGHTS_NAVIGATOR_SYSTEM_PROMPT
def analyze_dispute(
    dispute_type: str,
    description: str,
    location: str
):
    prompt = f"""
{RIGHTS_NAVIGATOR_SYSTEM_PROMPT}

User's dispute category:
{dispute_type}

User's location:
{location}

User's situation:
{description}

Analyze this situation and provide practical guidance.
"""

    return generate_text_response(prompt)