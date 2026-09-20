"""
Document analysis service.

This is the ONE place that needs to change once you pick an AI provider.
Set AI_PROVIDER in your .env to "mock", "anthropic", or "openai".

Everything returned must be a list of dicts shaped like:
    {
        "risk": "high" | "medium" | "low", | "benefit",
        "title": str,
        "description": str,
        "why_it_matters": str,
        "what_to_review": str,
    }
"""

import json

from ..config import settings

ANALYSIS_SYSTEM_PROMPT = """You are a legal document analysis assistant. \
Given a document's type and text, identify both the risks/obligations AND \
the benefits/advantages a reader should know about — not risks alone.

Respond with ONLY a JSON array (no prose, no markdown fences) of objects \
shaped exactly like this:
[
  {
    "risk": "high" | "medium" | "low" | "benefit",
    "title": "short clause name",
    "description": "1-2 sentences describing what the clause says",
    "why_it_matters": "1-2 sentences on why this matters to the reader",
    "what_to_review": "1-2 sentences on what specifically to check, ask about, or take advantage of"
  }
]

Use "high", "medium", or "low" for anything risky, obligation-heavy, or
restrictive. Use "benefit" for anything genuinely advantageous to the reader
— e.g. generous leave policy, above-market pay, strong severance terms,
flexible remote work, valuable perks, favorable renewal terms, protections
the document grants them.

Return as many findings as are genuinely warranted by the document's actual
content — do not pad the list to hit a target count, and do not omit real
findings to stay under one. Most documents will have somewhere between 3 and
8, but a short, narrow, or unusually clean document may have fewer, and a
long, clause-heavy document may have more. Order risks first (high to low),
then benefits. Return an empty array only if the document is too short,
garbled, or unclear to analyze meaningfully — not simply because it happens
to be low-risk; a document with no real risks or notable benefits should
still return at least one finding summarizing that it appears standard and
low-risk, rather than an empty array.
"""


async def analyze_document(document_type: str, document_text: str) -> list[dict]:
    provider = settings.ai_provider.lower()

    if provider == "anthropic":
        return await _analyze_with_anthropic(document_type, document_text)
    if provider == "openai":
        return await _analyze_with_openai(document_type, document_text)
    if provider == "gemini":
        return await _analyze_with_gemini(document_type, document_text)

    return _mock_analysis(document_type, document_text)


def _mock_analysis(document_type: str, document_text: str) -> list[dict]:
    """Placeholder findings so the rest of the app works with zero AI setup."""
    return [
        {
            "risk": "high",
            "title": "Termination Clause",
            "description": (
                "This clause may allow one party to terminate the agreement "
                "under conditions that could significantly affect you."
            ),
            "why_it_matters": (
                "You may want to understand exactly when the agreement can "
                "be terminated and whether notice is required."
            ),
            "what_to_review": (
                "Check the termination conditions, notice period, and "
                "consequences of ending the agreement."
            ),
        },
        {
            "risk": "medium",
            "title": "Working Hours",
            "description": (
                "The document specifies a weekly working requirement that "
                "should be understood before accepting the agreement."
            ),
            "why_it_matters": (
                "Your working hours can affect your responsibilities and "
                "overall commitment under the agreement."
            ),
            "what_to_review": (
                "Check whether additional hours, overtime, or changes to "
                "the schedule are addressed."
            ),
        },
        {
            "risk": "low",
            "title": "Contract Duration",
            "description": "The document specifies a defined duration for the agreement.",
            "why_it_matters": (
                "Knowing when the agreement begins and ends helps you "
                "understand the length of your commitment."
            ),
            "what_to_review": (
                "Check the start date, end date, and whether the agreement "
                "can be renewed."
            ),
        },
        {
            "risk": "benefit",
            "title": "Flexible Remote Work",
            "description": (
                "The agreement includes provisions allowing remote or "
                "hybrid work arrangements."
            ),
            "why_it_matters": (
                "This gives you meaningful flexibility in how and where "
                "you work, which many agreements don't include."
            ),
            "what_to_review": (
                "Confirm how many remote days are guaranteed and whether "
                "that can change unilaterally later."
            ),
        },
    ]


async def _analyze_with_anthropic(document_type: str, document_text: str) -> list[dict]:
    if not settings.anthropic_api_key:
        raise RuntimeError(
            "AI_PROVIDER is set to 'anthropic' but ANTHROPIC_API_KEY is missing."
        )

    import anthropic

    client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=2000,
        system=ANALYSIS_SYSTEM_PROMPT,
        messages=[
            {
                "role": "user",
                "content": (
                    f"Document type: {document_type}\n\n"
                    f"Document text:\n{document_text}"
                ),
            }
        ],
    )

    raw_text = "".join(
        block.text for block in response.content if block.type == "text"
    )
    return _parse_findings_json(raw_text)


async def _analyze_with_openai(document_type: str, document_text: str) -> list[dict]:
    if not settings.openai_api_key:
        raise RuntimeError(
            "AI_PROVIDER is set to 'openai' but OPENAI_API_KEY is missing."
        )

    from openai import OpenAI

    client = OpenAI(api_key=settings.openai_api_key)

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": ANALYSIS_SYSTEM_PROMPT},
            {
                "role": "user",
                "content": (
                    f"Document type: {document_type}\n\n"
                    f"Document text:\n{document_text}"
                ),
            },
        ],
    )

    raw_text = response.choices[0].message.content or "[]"
    return _parse_findings_json(raw_text)

async def _analyze_with_gemini(document_type: str, document_text: str) -> list[dict]:
    if not settings.gemini_api_key:
        raise RuntimeError(
            "AI_PROVIDER is set to 'gemini' but GEMINI_API_KEY is missing."
        )

    from google import genai

    client = genai.Client(api_key=settings.gemini_api_key)

    response = client.models.generate_content(
        model="gemini-3.6-flash",
        contents=(
            f"{ANALYSIS_SYSTEM_PROMPT}\n\n"
            f"Document type: {document_type}\n\n"
            f"Document text:\n{document_text}"
        ),
    )

    return _parse_findings_json(response.text)


def _parse_findings_json(raw_text: str) -> list[dict]:
    raw_text = raw_text.strip()

    if raw_text.startswith("```"):
        raw_text = raw_text.strip("`")
        if raw_text.lower().startswith("json"):
            raw_text = raw_text[4:]
        raw_text = raw_text.strip()

    try:
        findings = json.loads(raw_text)
    except json.JSONDecodeError as error:
        raise RuntimeError(f"AI response was not valid JSON: {error}") from error

    if not isinstance(findings, list):
        raise RuntimeError("AI response JSON was not a list of findings.")

    return findings