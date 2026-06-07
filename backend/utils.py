import pandas as pd
import numpy as np
import statsmodels.api as sm

# --------------------------
# THRESHOLDS for lagging parameters
# --------------------------
THRESHOLDS = {
    "Heart Rate (bpm)": 100,
    "SpO2 (%)": 92,
    "Suction Pressure (mmHg)": 70,
    "Latch/Tongue Motion (0_1)": 0.3,
    "Lip Compression Force (g)": 25
}

# --------------------------
# --------------------------
# Load & Train Model (Lazy Loaded)
# --------------------------
from threading import Lock

_model_lock = Lock()
_ols_model = None

FEATURES = [
    "Heart Rate (bpm)",
    "SpO2 (%)",
    "Suction Pressure (mmHg)",
    "Latch/Tongue Motion (0_1)",
    "Lip Compression Force (g)"
]

def get_ols_model():
    global _ols_model
    if _ols_model is None:
        with _model_lock:
            if _ols_model is None:
                print("[INFO] Lazy loading training data and training OLS model...")
                try:
                    df_train = pd.read_csv("feeding_readiness_new_data_cleaned.csv", encoding="ISO-8859-1")
                    df_train.columns = df_train.columns.str.encode('ascii', 'ignore').str.decode('ascii').str.strip()
                    
                    # Make suction pressure positive
                    df_train["Suction Pressure (mmHg)"] = df_train["Suction Pressure (mmHg)"] * -1
                    
                    X_train = df_train[FEATURES]
                    y_train = df_train["POFRAS Score (0_36)"]
                    
                    X_train_sm = sm.add_constant(X_train)
                    _ols_model = sm.OLS(y_train, X_train_sm).fit()
                    print("[OK] OLS model trained successfully.")
                except Exception as e:
                    print(f"[ERROR] Error training OLS model: {e}")
                    raise e
    return _ols_model

# --------------------------
# POFRAS Prediction Function
# --------------------------
def predict_readiness(data):
    ols_model = get_ols_model()
    sample = pd.DataFrame([[
        float(data["heartRate"]),
        float(data["spo2"]),
        float(data["suctionPressure"]),
        float(data["tongueMotion"]),
        float(data["lipCompression"])
    ]], columns=FEATURES)

    sample_sm = sm.add_constant(sample, has_constant="add")
    prediction = ols_model.get_prediction(sample_sm)
    summary = prediction.summary_frame(alpha=0.05).iloc[0]

    mean1= round(summary["mean"], 2)
    mean=min(mean1,35.4)
    mean_se = round(summary["mean_se"], 3)
    ci_lower = round(summary["mean_ci_lower"], 2)
    ci_upper = round(summary["mean_ci_upper"], 2)

    target_days_factor = 3
    adjusted_mean_se = min(mean_se, 0.999) +0.2
    
    time_to_feed1 = round(
        max(0, (36 - mean) / (target_days_factor * abs(1 - adjusted_mean_se))),
        2
    )
    time_to_feed=min(time_to_feed1, 32.4)



    return {
        "readinessScore": mean,
        "confidence": mean_se,
        "timeToFeed": time_to_feed,
        "ciLower": ci_lower,
        "ciUpper": ci_upper,
        "obsLower": round(summary["obs_ci_lower"], 2),
        "obsUpper": round(summary["obs_ci_upper"], 2)
    }

# --------------------------
# Derived Metrics Calculator
# --------------------------
def calculate_derived_averages(df_block):
    SUCK_THRESHOLD = 75
    sucks_per_min_list = []
    inter_suck_interval_list = []
    max_suck_pressure_list = []
    max_pressure = abs(df_block["Suction Pressure (mmHg)"]).max()

    max_suck_pressure_list.append(max_pressure)

    suck_count = len(df_block[df_block["Suction Pressure (mmHg)"] > SUCK_THRESHOLD])
    sucks_per_min = suck_count * 6
    sucks_per_min_list.append(sucks_per_min)

    if sucks_per_min > 0:
        inter_suck_interval = 60 / sucks_per_min
    else:
        inter_suck_interval = 0
    inter_suck_interval_list.append(inter_suck_interval)

    return {
        "avg_sucks_per_min": round(sum(sucks_per_min_list) / len(sucks_per_min_list), 2),
        "avg_inter_suck_interval": round(sum(inter_suck_interval_list) / len(inter_suck_interval_list), 2),
        "avg_max_suck_pressure": round(sum(max_suck_pressure_list) / len(max_suck_pressure_list), 2)
    }

# --------------------------
# Identify Lagging Parameters (ALL FEATURES)
# --------------------------
def identify_lagging(values):
    labels = [
        "Heart Rate (bpm)",
        "SpO2 (%)",
        "Suction Pressure (mmHg)",
        "Latch/Tongue Motion (0_1)",
        "Lip Compression Force (g)"
    ]

    lagging_params = []
    for i, value in enumerate(values):
        if labels[i] == "Suction Pressure (mmHg)":
            if abs(value) < THRESHOLDS[labels[i]]:
                lagging_params.append(labels[i])
        elif value < THRESHOLDS[labels[i]]:
            lagging_params.append(labels[i])

    return lagging_params

# --------------------------
# Cardiopulmonary Stability Evaluator
# --------------------------
def evaluate_cardiopulmonary_stability(avg_hr, avg_spo2, metrics):
    alerts = []
    unstable_params = []

    # SpO2 check
    if avg_spo2 < 88:
        alerts.append("Low oxygen saturation (SpO₂ < 88%)")
        unstable_params.append("SpO2 (%)")
    elif avg_spo2 > 100:
        alerts.append("High oxygen saturation (SpO₂ > 100%)")
        unstable_params.append("SpO2 (%)")

    # HR check
    if avg_hr < 100:
        alerts.append("Bradycardia (HR < 100 bpm)")
        unstable_params.append("Heart Rate (bpm)")
    elif avg_hr > 180:
        alerts.append("Tachycardia (HR > 180 bpm)")
        unstable_params.append("Heart Rate (bpm)")

    # Sucks/min check
    if metrics["avg_sucks_per_min"] < 30:
        alerts.append("Weak sucking (low sucks/min)")
        unstable_params.append("Sucks/min")
    elif metrics["avg_sucks_per_min"] > 90:
        alerts.append("Excessive sucking rate (possible fatigue)")
        unstable_params.append("Sucks/min")

    # Inter-suck interval check
    if metrics["avg_inter_suck_interval"] < 0.5:
        alerts.append("Too rapid sucking (interval < 0.5 sec)")
        unstable_params.append("Inter-suck Interval")
    elif metrics["avg_inter_suck_interval"] > 2.0:
        alerts.append("Prolonged interval between sucks")
        unstable_params.append("Inter-suck Interval")

    # Max suck pressure check
    if abs(metrics["avg_max_suck_pressure"]) < 50:
        alerts.append("Weak suction pressure (max < 50 mmHg)")
        unstable_params.append("Suction Pressure (mmHg)")

    return {
        "cps_status": "Unstable" if alerts else "Stable",
        "cps_alerts": alerts,
        "cps_unstable_params": unstable_params if alerts else []
    }

# --------------------------
# Process Dataset in 10-row Blocks
# --------------------------
def process_dataset(df_to_process, chunk_size=10):
    results = []
    for i in range(0, len(df_to_process), chunk_size):
        block = df_to_process.iloc[i:i+chunk_size]

        metrics = calculate_derived_averages(block)

        predictions, confidences, time_to_feeds = [], [], []
        ci_lowers, ci_uppers, obs_lowers, obs_uppers = [], [], [], []

        for _, row in block.iterrows():
            data = {
                "heartRate": row["Heart Rate (bpm)"],
                "spo2": row["SpO2 (%)"],
                "suctionPressure": row["Suction Pressure (mmHg)"],
                "tongueMotion": row["Latch/Tongue Motion (0_1)"],
                "lipCompression": row["Lip Compression Force (g)"]
            }
            pred = predict_readiness(data)
            predictions.append(pred["readinessScore"])
            confidences.append(pred["confidence"])
            time_to_feeds.append(pred["timeToFeed"])
            ci_lowers.append(pred["ciLower"])
            ci_uppers.append(pred["ciUpper"])
            obs_lowers.append(pred["obsLower"])
            obs_uppers.append(pred["obsUpper"])

        avg_pofras = round(np.mean(predictions), 2)
        avg_confidence = round(np.mean(confidences), 3)
        avg_time_to_feed = round(np.mean(time_to_feeds), 2)
        avg_ci_lower = round(np.mean(ci_lowers), 2)
        avg_ci_upper = round(np.mean(ci_uppers), 2)
        avg_obs_lower = round(np.mean(obs_lowers), 2)
        avg_obs_upper = round(np.mean(obs_uppers), 2)

        avg_hr = block["Heart Rate (bpm)"].mean()
        avg_spo2 = block["SpO2 (%)"].mean()
        sample_values = [
            avg_hr,
            avg_spo2,
            block["Suction Pressure (mmHg)"].mean(),
            block["Latch/Tongue Motion (0_1)"].mean(),
            block["Lip Compression Force (g)"].mean()
        ]

        # Cardiopulmonary check
        stability = evaluate_cardiopulmonary_stability(avg_hr, avg_spo2, metrics)

        # Independent lagging parameters check
        lagging_params = identify_lagging(sample_values)

        results.append({
            "chunk_start": i,
            "chunk_end": i + len(block) - 1,
            "avg_pofras": avg_pofras,
            "avg_confidence": avg_confidence,
            "avg_time_to_feed": avg_time_to_feed,
            "avg_ci_lower": avg_ci_lower,
            "avg_ci_upper": avg_ci_upper,
            "avg_obs_lower": avg_obs_lower,
            "avg_obs_upper": avg_obs_upper,
            **metrics,
            **stability,
            "lagging_params": lagging_params
        })

    return pd.DataFrame(results)

# --------------------------
# Example Usage
# --------------------------
if __name__ == "__main__":
    df_test = pd.read_csv("cardiopulmonary_data.csv", encoding="ISO-8859-1")
    df_test.columns = df_test.columns.str.encode('ascii', 'ignore').str.decode('ascii').str.strip()
    df_test["Suction Pressure (mmHg)"] = df_test["Suction Pressure (mmHg)"] * -1

    summary_df = process_dataset(df_test, chunk_size=10)
    print(summary_df.head(10))
