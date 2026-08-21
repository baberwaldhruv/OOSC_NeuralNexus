import os
from dotenv import load_dotenv
from google import genai
from app.ai.prompts.rti_prompt import RTI_SYSTEM_PROMPT
from app.ai.prompts.extraction_prompt import CASE_EXTRACTION_PROMPT
from app.ai.prompts.rti_draft_prompt import RTI_DRAFT_PROMPT
import json
from google.genai.errors import APIError, ServerError
from fastapi import HTTPException, status
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")
if not api_key:
    raise ValueError("GEMINI_API_KEY is not set")
client = genai.Client(api_key=api_key)
def generate_response(messages: list, missing_fields: list) -> str:
    missing_context = ""
    if missing_fields:
        missing_context = f"\nMissing required information to ask for: {', '.join(missing_fields)}."

    system_instruction = f"{RTI_SYSTEM_PROMPT}\n{missing_context}"

    # Build conversation string
    formatted_convo = "\n".join(
        f"{m['role'].capitalize()}: {m['content']}" for m in messages
    )

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=formatted_convo,
        config=types.GenerateContentConfig(
            system_instruction=system_instruction
        )
    )

    return response.text

def extract_case(messages: list) -> dict:
    conversation = "\n".join(
        f"{message['role']}: {message['content']}"
        for message in messages
    )

    prompt = f"""
{CASE_EXTRACTION_PROMPT}

Conversation:

{conversation}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={
                "response_mime_type": "application/json"
            }
        )
        return json.loads(response.text)

    except ServerError as e:
        # Temporary outage / 503 from Gemini upstream
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Temporary AI service disruption. Please try again shortly."
        ) from e

    except APIError as e:
        # Bad Gateway / upstream API failure (auth, quota, malformed request upstream)
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider communication error: {e.message}"
        ) from e

    except (json.JSONDecodeError, KeyError, TypeError) as e:
        # The AI returned invalid or incomplete JSON schema
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Could not extract a valid or complete case from the conversation."
        ) from e


def generate_rti_draft(case: dict) -> str:
    prompt = f"""
{RTI_DRAFT_PROMPT}

Citizen case information:

{case}
"""
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )
        if not response.text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incomplete case data; draft could not be generated."
            )
        return response.text

    except ServerError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Temporary AI service disruption during draft generation."
        ) from e

    except APIError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider communication error: {e.message}"
        ) from e

def generate_text_response(prompt: str) -> str:
    try:
        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt
        )

        if not response.text:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="AI returned an empty response."
            )

        return response.text

    except ServerError as e:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Temporary AI service disruption. Please try again shortly."
        ) from e

    except APIError as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"AI provider communication error: {e.message}"
        ) from e