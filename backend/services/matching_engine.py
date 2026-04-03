from firebase_config import db

def find_best_technician(request):
    docs = db.collection("technicians").stream()
    technicians = []

    for doc in docs:
        data = doc.to_dict()
        print("TECH FOUND:", data)   # 🔥 DEBUG
        technicians.append(data)

    # ✅ pick available technician
    for tech in technicians:
        if tech.get("available") == True:
            return tech

    # ✅ fallback (IMPORTANT)
    return {
        "name": "Demo Technician",
        "available": True
    }