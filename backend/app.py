from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/")
def home():
    return "Backend is running!"

@app.route("/api/test")
def test():
    return "API working!"

# Service request API
@app.route("/api/request", methods=["POST"])
def request_service():
    data = request.json
    return jsonify({
        "message": "Service request received",
        "data": data
    })

if __name__ == "__main__":
    app.run(debug=True)