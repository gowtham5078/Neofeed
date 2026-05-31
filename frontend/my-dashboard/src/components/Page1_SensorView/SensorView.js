import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './SensorView.css';

function SensorView() {
    const [, setIndex] = useState(0);
    const [data, setData] = useState({});
    const [timestamp, setTimestamp] = useState('00:00');
    const [error, setError] = useState('');
    const indexRef = useRef(0); 

    const formatTimestamp = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const fetchRow = async (currentIndex) => {
        try {
            const res = await axios.get(`http://127.0.0.1:5000/api/stream/${currentIndex}`);
            setData(res.data);
            setTimestamp(formatTimestamp(currentIndex * 5)); // 5s interval simulation
            setError('');
            indexRef.current = currentIndex;
        } catch (err) {
            if (err.response && err.response.status === 404) {
                setError('Awaiting telemetry signal refresh...');
            } else {
                setError('Loss of telemetry feed. Retrying connection...');
            }
        }
    };

    useEffect(() => {
        fetchRow(indexRef.current);

        const interval = setInterval(() => {
            const nextIndex = indexRef.current + 1;
            fetchRow(nextIndex);
            setIndex(nextIndex); 
        }, 5000);

        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Icon & Unit mapping for high-end telemetry presentation
    const metricMeta = {
        'Heart Rate (bpm)': { label: 'Heart Rate', icon: '❤️', unit: 'bpm', color: 'cyan' },
        'SpO2 (%)': { label: 'SpO₂ Level', icon: '🫁', unit: '%', color: 'teal' },
        'Suction Pressure (mmHg)': { label: 'Suction Force', icon: '🌀', unit: 'mmHg', color: 'violet' },
        'Latch/Tongue Motion (0_1)': { label: 'Latch Motion', icon: '👅', unit: 'val', color: 'amber' },
        'Lip Compression Force (g)': { label: 'Compression', icon: '👄', unit: 'g', color: 'rose' }
    };

    return (
        <div className="sensor-container">
            <div className="sensor-header-row">
                <h2 className="telemetry-box-title">⚡ Live Clinical Telemetry</h2>
                <div className="active-stream-badge">
                    <span className="pulse-indicator"></span>
                    <span>STREAMING</span>
                </div>
            </div>
            
            <p className="timestamp">
                ⏱️ Elapsed: <span className="time-highlight">{timestamp}</span> | Cycle Sequence: <span className="cycle-highlight">{indexRef.current + 1}</span>
            </p>

            {error ? (
                <div className="sensor-stream-error">
                    <span className="warning-icon">⚠️</span>
                    <span className="error-text">{error}</span>
                </div>
            ) : (
                <div className="sensor-grid-deck">
                    {Object.entries(data)
                        .filter(([key]) => key !== "POFRAS Score (0_36)")
                        .map(([key, value]) => {
                            const meta = metricMeta[key] || { label: key, icon: '📈', unit: '', color: 'cyan' };
                            return (
                                <div key={key} className={`sensor-grid-card ${meta.color}`}>
                                    <div className="card-top">
                                        <span className="meta-icon">{meta.icon}</span>
                                        <span className="meta-label">{meta.label}</span>
                                    </div>
                                    <div className="card-bottom">
                                        <span className="meta-value">{value}</span>
                                        <span className="meta-unit">{meta.unit}</span>
                                    </div>
                                    <div className="card-spark-line"></div>
                                </div>
                            );
                        })}
                </div>
            )}
        </div>
    );
}

export default SensorView;