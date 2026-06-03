from flask import Flask, request, jsonify
from flask_cors import CORS
from config import Config
from database import db

from flask_jwt_extended import (
    JWTManager,
    jwt_required,
    get_jwt_identity
)

from models import (
    User,
    InfantVitals,
    Prediction,
    Alert
)

from auth import auth_bp
from flask_socketio import SocketIO

import pandas as pd
import time
from threading import Lock

from utils import (
    predict_readiness,
    process_dataset,
    evaluate_cardiopulmonary_stability,
    calculate_derived_averages
)

app = Flask(__name__)
app.config.from_object(Config)

# ---------------------------
# DB + JWT INIT
# ---------------------------
db.init_app(app)
jwt = JWTManager(app)

CORS(app)

# ---------------------------
# REGISTER BLUEPRINTS
# ---------------------------
app.register_blueprint(auth_bp)

# ---------------------------
# SOCKET.IO CONFIG
# ---------------------------
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="threading"
)

@socketio.on("connect")
def handle_connect():
    print("✅ Frontend Connected")


thread = None
thread_lock = Lock()

# ---------------------------
# Required Columns
# ---------------------------
REQUIRED_COLUMNS = [
    'Heart Rate (bpm)',
    'SpO2 (%)',
    'Suction Pressure (mmHg)',
    'Latch/Tongue Motion (0_1)',
    'Lip Compression Force (g)'
]

# ============================================
# LIVE SENSOR STREAMING
# ============================================
def background_sensor_stream():

    index = 0

    while True:

        try:

            df = pd.read_csv(
                "neonate_data1.csv",
                encoding="ISO-8859-1"
            )

            df.columns = [
                col.replace('–', '-')
                for col in df.columns
            ]

            if len(df) == 0:
                socketio.sleep(1)
                continue

            if index >= len(df):
                index = 0

            row = df.iloc[index].to_dict()

            print(f"📡 Streaming row {index}")

            # ============================
            # ML PREDICTION
            # ============================
            prediction = predict_readiness({
                "heartRate":      row["Heart Rate (bpm)"],
                "spo2":           row["SpO2 (%)"],
                "suctionPressure": row["Suction Pressure (mmHg)"],
                "tongueMotion":   row["Latch/Tongue Motion (0_1)"],
                "lipCompression": row["Lip Compression Force (g)"]
            })

            # ============================
            # STABILITY CHECK
            # ============================
            metrics = {
                "avg_sucks_per_min":      40,
                "avg_inter_suck_interval": 1.0,
                "avg_max_suck_pressure":  abs(row["Suction Pressure (mmHg)"])
            }

            stability = evaluate_cardiopulmonary_stability(
                row["Heart Rate (bpm)"],
                row["SpO2 (%)"],
                metrics
            )

            # ============================
            # SEND LIVE DATA
            # ============================
            socketio.emit("sensor_update", {
                "sensorData": row,
                "prediction": prediction,
                "stability":  stability
            })

            # ============================
            # SEND ALERTS
            # ============================
            if stability["cps_status"] == "Unstable":
                socketio.emit("critical_alert", {
                    "alerts": stability["cps_alerts"]
                })

            index += 1
            socketio.sleep(1)

        except Exception as e:
            print("❌ Stream Error:", e)
            socketio.sleep(2)


# ---------------------------
# GET FULL DATASET
# (protected — must be logged in)
# ---------------------------
@app.route('/api/data/<neonate_id>', methods=['GET'])
@jwt_required()
def get_data(neonate_id):
    try:
        df = pd.read_csv(
            "neonate_data1.csv",
            encoding="ISO-8859-1"
        )
        df.columns = [
            col.replace('–', '-').replace('–', '-')
            for col in df.columns
        ]
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# SINGLE ROW STREAM API
# ---------------------------
@app.route('/api/stream/<int:index>', methods=['GET'])
@jwt_required()
def stream_data(index):
    try:
        df = pd.read_csv(
            "neonate_data1.csv",
            encoding="ISO-8859-1"
        )
        if index >= len(df):
            return jsonify({"error": "Index out of range"}), 404
        return jsonify(df.iloc[index].to_dict())
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# MANUAL PREDICTION
# ---------------------------
@app.route('/api/predict', methods=['POST'])
@jwt_required()
def predict():
    try:
        data   = request.json
        result = predict_readiness(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# DATASET PROCESSING
# ---------------------------
@app.route('/api/process-dataset', methods=['GET'])
@jwt_required()
def process_dataset_api():
    try:
        df_test = pd.read_csv(
            "cardiopulmonary_data.csv",
            encoding="ISO-8859-1"
        )
        df_test.columns = (
            df_test.columns
            .str.encode('ascii', 'ignore')
            .str.decode('ascii')
            .str.strip()
        )
        df_test["Suction Pressure (mmHg)"] *= -1
        summary_df = process_dataset(df_test, chunk_size=10)
        return jsonify(summary_df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ---------------------------
# CURRENT USER INFO
# ---------------------------
@app.route('/api/me', methods=['GET'])
@jwt_required()
def me():
    identity = get_jwt_identity()
    return jsonify(identity)


# ---------------------------
# ROOT
# ---------------------------
@app.route('/')
def home():
    return "🩺 NeoFEED Real-Time Backend Running"


# ---------------------------
# CREATE TABLES + START
# ---------------------------
if __name__ == "__main__":

    with app.app_context():
        db.create_all()
        print("✅ Database tables created")

    thread = socketio.start_background_task(
        background_sensor_stream
    )

    socketio.run(app, debug=True)
