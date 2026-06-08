# =========================
# NeoFEED Backend (Production Ready)
# =========================

import os
import json
import time
import pandas as pd
from threading import Lock

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from flask_socketio import SocketIO

from config import Config
from database import db
from models import User

from auth import auth_bp
from utils import (
    predict_readiness,
    process_dataset,
    evaluate_cardiopulmonary_stability
)

# =========================
# APP INIT
# =========================

app = Flask(__name__)
app.config.from_object(Config)

# =========================
# CORS (IMPORTANT FIX)
# =========================
CORS(app, resources={
    r"/*": {
        "origins": [
            "http://localhost:3000",
            "https://*.vercel.app"
        ]
    }
})

# =========================
# DB + JWT
# =========================
db.init_app(app)
jwt = JWTManager(app)

# =========================
# BLUEPRINTS
# =========================
app.register_blueprint(auth_bp)

# =========================
# SOCKET.IO (Render-safe)
# =========================
socketio = SocketIO(
    app,
    cors_allowed_origins="*",
    async_mode="eventlet"
)

thread = None
thread_lock = Lock()

# =========================
# BACKGROUND STREAM
# =========================

def background_sensor_stream():
    index = 0
    df = None

    try:
        print("[INFO] Loading dataset...")
        df = pd.read_csv("neonate_data1.csv", encoding="ISO-8859-1")
        df.columns = [c.replace('–', '-') for c in df.columns]
        print("[OK] Dataset loaded:", len(df))
    except Exception as e:
        print("[ERROR] Dataset load failed:", e)

    while True:
        try:
            if df is None:
                socketio.sleep(2)
                continue

            if index >= len(df):
                index = 0

            row = df.iloc[index].to_dict()

            prediction = predict_readiness({
                "heartRate": row["Heart Rate (bpm)"],
                "spo2": row["SpO2 (%)"],
                "suctionPressure": row["Suction Pressure (mmHg)"],
                "tongueMotion": row["Latch/Tongue Motion (0_1)"],
                "lipCompression": row["Lip Compression Force (g)"]
            })

            metrics = {
                "avg_sucks_per_min": 40,
                "avg_inter_suck_interval": 1.0,
                "avg_max_suck_pressure": abs(row["Suction Pressure (mmHg)"])
            }

            stability = evaluate_cardiopulmonary_stability(
                row["Heart Rate (bpm)"],
                row["SpO2 (%)"],
                metrics
            )

            socketio.emit("sensor_update", {
                "sensorData": row,
                "prediction": prediction,
                "stability": stability
            })

            if stability["cps_status"] == "Unstable":
                socketio.emit("critical_alert", {
                    "alerts": stability["cps_alerts"]
                })

            index += 1
            socketio.sleep(1)

        except Exception as e:
            print("[STREAM ERROR]", e)
            socketio.sleep(2)


# =========================
# SOCKET CONNECT
# =========================

@socketio.on("connect")
def handle_connect():
    print("[OK] Client connected")

    global thread
    with thread_lock:
        if thread is None:
            thread = socketio.start_background_task(background_sensor_stream)


# =========================
# TEST ROUTE
# =========================

@app.route("/")
def home():
    return "🩺 NeoFEED Backend Running on Cloud"


# =========================
# GET ALL DATA
# =========================

@app.route("/api/data/<neonate_id>", methods=["GET"])
@jwt_required()
def get_data(neonate_id):
    try:
        df = pd.read_csv("neonate_data1.csv", encoding="ISO-8859-1")
        return jsonify(df.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# LOGIN TEST HELP DEBUG (IMPORTANT)
# =========================

@app.route("/api/debug-users", methods=["GET"])
def debug_users():
    users = User.query.all()
    return jsonify([u.username for u in users])


# =========================
# MANUAL PREDICTION
# =========================

@app.route("/api/predict", methods=["POST"])
@jwt_required()
def predict():
    try:
        data = request.json
        result = predict_readiness(data)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# PROCESS DATASET
# =========================

@app.route("/api/process-dataset", methods=["GET"])
@jwt_required()
def process_dataset_api():
    try:
        df = pd.read_csv("cardiopulmonary_data.csv", encoding="ISO-8859-1")
        df.columns = df.columns.str.encode('ascii', 'ignore').str.decode('ascii')
        summary = process_dataset(df, chunk_size=10)
        return jsonify(summary.to_dict(orient="records"))
    except Exception as e:
        return jsonify({"error": str(e)}), 500


# =========================
# USER INFO
# =========================

@app.route("/api/me", methods=["GET"])
@jwt_required()
def me():
    return jsonify(get_jwt_identity())


# =========================
# DB INIT SAFE (IMPORTANT FIX)
# =========================

def init_db():
    try:
        with app.app_context():
            db.create_all()
            print("[OK] DB tables ready")

            if not User.query.first():
                print("[INFO] Seeding users...")

                users_file = os.path.join(os.path.dirname(__file__), "users.json")

                if os.path.exists(users_file):
                    with open(users_file, "r") as f:
                        users_data = json.load(f)

                    import bcrypt

                    for username, info in users_data.items():
                        hashed = bcrypt.hashpw(
                            info["password"].encode(),
                            bcrypt.gensalt()
                        ).decode()

                        user = User(
                            username=username,
                            password=hashed,
                            role="parent",
                            infant_id=username
                        )
                        db.session.add(user)

                    db.session.commit()
                    print("[OK] Users seeded")

                else:
                    print("[WARN] users.json missing")

    except Exception as e:
        print("[DB ERROR]", e)


init_db()


# =========================
# MAIN START
# =========================

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))

    socketio.run(
        app,
        host="0.0.0.0",
        port=port
    )