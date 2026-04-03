@request_bp.route("/api/request", methods=["POST"])
def request_service():
    try:
        data = request.json
        print("📥 RECEIVED DATA:", data)

        # 🔥 urgency
        urgency = calculate_urgency(data)
        print("🔥 URGENCY:", urgency)

        data["urgency"] = urgency

        # 🔥 create request
        request_id = create_request(data)
        print("🆔 REQUEST ID:", request_id)

        # 🔥 assign technician
        technician = find_best_technician(data)
        print("👷 TECHNICIAN:", technician)

        if not technician:
            technician = {"name": "Not Assigned"}

        # 🔥 update DB
        db.collection("requests").document(request_id).update({
            "assigned_technician": technician,
            "status": "ASSIGNED",
            "urgency": urgency
        })

        return jsonify({
            "request_id": request_id,
            "assigned_technician": technician,
            "urgency": urgency,
            "status": "ASSIGNED"
        })

    except Exception as e:
        print("❌ ERROR:", e)
        return jsonify({"error": str(e)}), 500