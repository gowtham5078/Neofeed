import React, { useEffect, useState } from 'react';

import { socket } from '../../api';

import './SensorView.css';

function SensorView() {

    // =========================================
    // STATES
    // =========================================
    const [data, setData] = useState({});

    const [prediction, setPrediction] = useState(null);

    const [stability, setStability] = useState(null);

    const [alerts, setAlerts] = useState([]);

    const [timestamp, setTimestamp] = useState('');

    const [connectionStatus, setConnectionStatus] =
        useState('Connecting...');

    // =========================================
    // FORMAT CURRENT TIME
    // =========================================
    const getCurrentTime = () => {

        const now = new Date();

        return now.toLocaleTimeString();

    };

    // =========================================
    // SOCKET.IO LIVE STREAM
    // =========================================
    useEffect(() => {

        // SOCKET CONNECTED
        socket.on("connect", () => {

            console.log("✅ Socket Connected");

            setConnectionStatus("🟢 Live");

        });

        // SOCKET DISCONNECTED
        socket.on("disconnect", () => {

            console.log("❌ Socket Disconnected");

            setConnectionStatus("🔴 Disconnected");

        });

        // =====================================
        // LIVE SENSOR UPDATE
        // =====================================
        socket.on("sensor_update", (payload) => {

            console.log("📡 Live Payload:", payload);

            // SENSOR DATA
            setData(payload.sensorData);

            // ML PREDICTION
            setPrediction(payload.prediction);

            // STABILITY ANALYSIS
            setStability(payload.stability);

            // TIMESTAMP
            setTimestamp(getCurrentTime());

        });

        // =====================================
        // CRITICAL ALERTS
        // =====================================
        socket.on("critical_alert", (alertData) => {

            console.log("🚨 ALERT:", alertData);

            setAlerts(alertData.alerts);

        });

        // =====================================
        // CLEANUP
        // =====================================
        return () => {

            socket.off("connect");

            socket.off("disconnect");

            socket.off("sensor_update");

            socket.off("critical_alert");

        };

    }, []);

    return (

        <div className="sensor-container">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <h2>
                🩺 NeoFEED Live ICU Monitor
            </h2>

            <p className="timestamp">

                ⏱️ Last Update: {timestamp}

            </p>

            <p className="connection-status">

                {connectionStatus}

            </p>

            {/* ================================= */}
            {/* ALERT SECTION */}
            {/* ================================= */}

            {alerts.length > 0 && (

                <div
                    style={{
                        background: "#ff4d4d",
                        color: "white",
                        padding: "15px",
                        borderRadius: "10px",
                        marginBottom: "20px"
                    }}
                >

                    <h3>
                        🚨 Critical Alerts
                    </h3>

                    {alerts.map((alert, index) => (

                        <p key={index}>
                            {alert}
                        </p>

                    ))}

                </div>

            )}

            {/* ================================= */}
            {/* LIVE SENSOR DATA */}
            {/* ================================= */}

            <div className="sensor-card">

                {Object.entries(data)

                    .filter(
                        ([key]) =>
                            key !==
                            "POFRAS Score (0_36)"
                    )

                    .map(([key, value]) => (

                        <div
                            key={key}
                            className="sensor-row"
                        >

                            <span className="sensor-label">

                                {key}

                            </span>

                            <span className="sensor-value">

                                {value}

                            </span>

                        </div>

                    ))}

            </div>

            {/* ================================= */}
            {/* ML PREDICTION PANEL */}
            {/* ================================= */}

            {prediction && (

                <div
                    style={{
                        background: "#f4f4f4",
                        padding: "20px",
                        borderRadius: "10px",
                        marginTop: "20px"
                    }}
                >

                    <h3>
                        🤖 ML Readiness Prediction
                    </h3>

                    <p>

                        Readiness Score:
                        {" "}
                        <strong>
                            {prediction.readinessScore}
                        </strong>

                    </p>

                    <p>

                        Confidence Interval:
                        {" "}
                        ±{prediction.confidence}

                    </p>

                    <p>

                        Time To Full Feeding:
                        {" "}
                        {prediction.timeToFeed} days

                    </p>

                    <p>

                        CI Lower:
                        {" "}
                        {prediction.ciLower}

                    </p>

                    <p>

                        CI Upper:
                        {" "}
                        {prediction.ciUpper}

                    </p>

                </div>

            )}

            {/* ================================= */}
            {/* CARDIOPULMONARY STABILITY */}
            {/* ================================= */}

            {stability && (

                <div
                    style={{
                        background:
                            stability.cps_status ===
                            "Stable"

                                ? "#d4edda"

                                : "#f8d7da",

                        color:
                            stability.cps_status ===
                            "Stable"

                                ? "#155724"

                                : "#721c24",

                        padding: "20px",

                        borderRadius: "10px",

                        marginTop: "20px"
                    }}
                >

                    <h3>
                        ❤️ Cardiopulmonary Stability
                    </h3>

                    <p>

                        Status:
                        {" "}

                        <strong>
                            {stability.cps_status}
                        </strong>

                    </p>

                    {stability.cps_alerts &&
                        stability.cps_alerts.map(
                            (alert, index) => (

                                <p key={index}>

                                    ⚠️ {alert}

                                </p>

                            )
                        )}

                </div>

            )}

        </div>
    );
}

export default SensorView;
