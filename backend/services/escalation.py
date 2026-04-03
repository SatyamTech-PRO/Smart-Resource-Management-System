def check_escalation(request):
    if request["status"] == "PENDING" and request["time"] > 10:
        return "ESCALATE_TO_ADMIN"
    return "OK"