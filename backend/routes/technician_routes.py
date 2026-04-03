from flask import Blueprint, request, jsonify

tech_bp = Blueprint("tech", __name__)

@tech_bp.route("/api/update-status", methods=["POST"])
def update_status():
    data = request.json
    return jsonify({"message": "Status updated", "data": data})