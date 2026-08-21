CORE_REQUIRED_FIELDS = [
    "issue",
    "district",
    "state",
    "department",
    "information_requested"
]

def validate_case(case: dict) -> dict:
    missing_fields = []

    for field in CORE_REQUIRED_FIELDS:
        if not case.get(field):
            missing_fields.append(field)

    # Location check: Require at least village OR city
    if not case.get("village") and not case.get("city"):
        missing_fields.append("village_or_city")

    return {
        "ready_to_draft": len(missing_fields) == 0,
        "missing_fields": missing_fields
    }