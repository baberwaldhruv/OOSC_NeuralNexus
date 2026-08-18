def create_case():
    return {
        "issue": None,
        "village": None,
        "city": None,
        "district": None,
        "state": None,
        "department": None,
        "information_requested": None,
        "project_details": None,
        "applicant_name": None,
        "applicant_address": None
    }


def update_case(case: dict, extracted_data: dict):
    for key, value in extracted_data.items():
        if value is not None:
            case[key] = value

    return case