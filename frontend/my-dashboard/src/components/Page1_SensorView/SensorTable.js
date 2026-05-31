import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SensorView.css';

function SensorTable() {
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/data/101');
                setData(res.data);
            } catch (err) {
                console.error('Error fetching full dataset:', err);
            }
        };
        
        fetchAll();
        const fetchInterval = setInterval(fetchAll, 10000); 
        return () => clearInterval(fetchInterval);
    }, []);

    const headers = data[0]
        ? Object.keys(data[0]).filter((key) => key !== "POFRAS Score (0_36)")
        : [];

    const hasAlert = (row) => {
        return (
            (row['Heart Rate (bpm)'] && row['Heart Rate (bpm)'] < 130) ||
            (row['Latch/Tongue Motion (0_1)'] && row['Latch/Tongue Motion (0_1)'] < 0.5) ||
            (row['Lip Compression Force (g)'] && row['Lip Compression Force (g)'] < 30) ||
            (row['SpO2 (%)'] && row['SpO2 (%)'] < 92) ||
            (row['Suction Pressure (mmHg)'] && row['Suction Pressure (mmHg)'] < 60)
        );
    };

    return (
        <div className="table-container">
            <h2>📊 Full Sensor Log Matrix</h2>
            <div className="table-scroll-wrapper">
                <table className="clinical-table">
                    <thead>
                        <tr>
                            {headers.map((key) => (
                                <th key={key}>{key}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, i) => (
                            <tr
                                key={i}
                                className={hasAlert(row) ? "alert-row-glowing" : ""}
                            >
                                {headers.map((key, j) => (
                                    <td key={j}>{row[key]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {data.length === 0 && <p className="stream-status">Accessing telemetry matrix...</p>}
        </div>
    );
}

export default SensorTable;