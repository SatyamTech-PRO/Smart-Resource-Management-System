from firebase_config import db

def create_request(data):
    doc_ref = db.collection("requests").document()

    doc_ref.set({
        "type": data.get("type"),
        "description": data.get("description"),
        "location": data.get("location"),
        "status": "REQUESTED",
        "urgency": data.get("urgency", "LOW")
    })

    return doc_ref.id