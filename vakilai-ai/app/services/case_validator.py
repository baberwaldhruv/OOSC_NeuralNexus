REQUIRED_FIELDS = [
    "issue",
    "village",
    "district",
    "state",
    "department",
    "information_requested",
    "project_details"
]


def validate_case(case: dict) -> dict:
    missing_fields = []

    for field in REQUIRED_FIELDS:
        if not case.get(field):
            missing_fields.append(field)

    return {
        "ready_to_draft": len(missing_fields) == 0,
        "missing_fields": missing_fields
    }