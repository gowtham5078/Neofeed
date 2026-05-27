import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './SensorView.css';

function SensorTable() {
    const [data, setData] = useState([]);

    // --------------------------------------------------------
    // Periodic Data Fetching (e.g., checks for updates every 10 seconds)
    // --------------------------------------------------------
    useEffect(() => {
        const fetchAll = async () => {
            try {
                // Fetch the entire, latest dataset from the backend
                const res = await axios.get('http://127.0.0.1:5000/api/data/101');
                
                // Directly set the new data. This will re-render the table completely.
                setData(res.data);
            } catch (err) {
                console.error('Error fetching full dataset:', err);
            }
        };
        
        // 1. Initial fetch
        fetchAll();

        // 2. Set up interval for repeated fetching (e.g., every 10 seconds)
        const fetchInterval = setInterval(fetchAll, 10000); 

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(fetchInterval);
    }, []); // Empty dependency array means this runs once on mount

    // Headers without POFRAS Score
    const headers = data[0]
        ? Object.keys(data[0]).filter((key) => key !== "POFRAS Score (0_36)")
        : [];

    // Function to check alerts (Logic updated to use correct column names)
    // Note: The column names in the provided logic seem incorrect based on 
    // the backend's FEATURES list ("Latch/Tongue Motion (0_1)", etc.).
    // Assuming the table headers reflect the full names from the CSV.
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
            <h2>📊 Full Sensor Dataset</h2>
            <table>
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
                            className={hasAlert(row) ? "alert-row" : ""}
                            // Applied conditional styling only if an alert exists
                            style={hasAlert(row) ? { background: "linear-gradient(90deg, #ffcccc, #ff6666)" } : {}}
                        >
                            {headers.map((key, j) => (
                                <td key={j}>{row[key]}</td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            {data.length === 0 && <p>Loading sensor data...</p>}
        </div>
    );
}

export default SensorTable;