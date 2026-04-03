def calculate_urgency(data):
    description = data.get("description", "").lower().strip()

    print("DESCRIPTION:", description)  # DEBUG

    if "spark" in description or "fire" in description:
        return "HIGH"
    elif "not working" in description:
        return "MEDIUM"
    else:
        return "LOW"