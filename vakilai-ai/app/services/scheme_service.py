from app.ai.prompts.scheme_prompt import SCHEME_ELIGIBILITY_PROMPT
from app.ai.llm import generate_text_response
def check_scheme_eligibility(user_query: str, scheme_context: str = "") -> str:
    prompt = SCHEME_ELIGIBILITY_PROMPT.format(
        user_query=user_query,
        scheme_context=scheme_context if scheme_context else "General Indian Welfare Schemes"
    )
    return generate_text_response(prompt)