from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import json
from utils import predict_readiness, process_dataset 

app = Flask(__name__)
CORS(app)

# ---------------------------
# Load users from JSON
# ---------------------------
try:
    with open("users.json", "r") as f:
        users = json.load(f)
except FileNotFoundError:
    users = {}
    print("Warning: users.json not found. No login credentials loaded.")

# ---------------------------
# Updated Required Columns for Validation (POFRAS removed)
# ---------------------------
REQUIRED_COLUMNS = [
    'Heart Rate (bpm)',
    'SpO2 (%)',
    'Suction Pressure (mmHg)',
    'Latch/Tongue Motion (0_1)',
    'Lip Compression Force (g)'
]

# ---------------------------
# Auth Endpoint (No change)
# ---------------------------
@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    user_id = str(data.get("userId"))
    password = data.get("password")

    if user_id in users and users[user_id]["password"] == password:
        return jsonify({"success": True, "neonateId": user_id})
    return jsonify({"success": False, "message": "Invalid credentials"}), 401

# ---------------------------
# Raw Neonate Data Endpoint (Updated)
# ---------------------------
@app.route('/api/data/<neonate_id>', methods=['GET'])
def get_data(neonate_id):
    try:
        df = pd.read_csv("neonate_data1.csv", encoding="ISO-8859-1")
        df.columns = [col.replace('–', '-').replace('–', '-') for col in df.columns]

        # Validation uses the updated, smaller list of columns
        if not all(col in df.columns for col in REQUIRED_COLUMNS):
            missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
            return jsonify({"error": f"Missing columns in CSV: {missing}"}), 400

        # Note: If you want to include the timestamp, you should add it to the REQUIRED_COLUMNS list.
        return jsonify(df.to_dict(orient="records"))

    except FileNotFoundError:
        return jsonify({"error": "neonate_data.csv not found"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Stream Single Row Endpoint (Updated)
# ---------------------------
@app.route('/api/stream/<int:index>', methods=['GET'])
def stream_data(index):
    try:
        df = pd.read_csv("neonate_data1.csv", encoding="ISO-8859-1")
        df.columns = [col.replace('–', '-').replace('–', '-') for col in df.columns]

        # Validation uses the updated, smaller list of columns
        if not all(col in df.columns for col in REQUIRED_COLUMNS):
            missing = [col for col in REQUIRED_COLUMNS if col not in df.columns]
            return jsonify({"error": f"Missing columns in CSV: {missing}"}), 400

        if index >= len(df):
            return jsonify({"error": "Index out of range"}), 404

        return jsonify(df.iloc[index].to_dict())

    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Prediction (Manual Input) Endpoint
# ---------------------------
@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.json
    try:
        result = predict_readiness(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Page 2: Process Dataset Endpoint
# ---------------------------
@app.route('/api/process-dataset', methods=['GET'])
def process_dataset_api():
    """
    API endpoint to process cardiopulmonary_data.csv and return a summary of metrics.
    """
    try:
        df_test = pd.read_csv("cardiopulmonary_data.csv", encoding="ISO-8859-1")
        df_test.columns = df_test.columns.str.encode('ascii', 'ignore').str.decode('ascii').str.strip()
        df_test["Suction Pressure (mmHg)"] = df_test["Suction Pressure (mmHg)"] * -1
        
        summary_df = process_dataset(df_test, chunk_size=10)
        return jsonify(summary_df.to_dict(orient="records"))
    except FileNotFoundError:
        return jsonify({"error": "cardiopulmonary_data.csv not found"}), 500
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ---------------------------
# Root Endpoint
# ---------------------------
@app.route('/')
def home():
    return "🩺 NeoFEED backend is running. Use /api/login, /api/data/<neonate_id>, /api/stream/<index>, /api/predict, or /api/process-dataset"

# ---------------------------
# Run App
# ---------------------------
if __name__ == '__main__':
    print("🩺 NeoFEED backend running...")
    app.run(debug=True)
