import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import './SensorView.css';

function ParameterChart() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState('');
    const [index, setIndex] = useState(0); // This controls how many points are visible
    const [lastDataLength, setLastDataLength] = useState(0);

    // --------------------------------------------------------
    // 1. Data Fetching (Runs periodically to get latest file)
    // --------------------------------------------------------
    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/data/101');
                const newData = res.data;

                // Check if the file has been updated with new rows
                if (newData.length > lastDataLength) {
                    // *** FIX 1: Update the full dataset ***
                    setData(newData);
                    setLastDataLength(newData.length);
                    
                    // The index is NOT reset here. The streaming effect (useEffect 2) 
                    // will automatically continue up to the new data length.

                    // Set default selected parameter only on initial load
                    if (!selected && newData.length > 0) {
                        const firstKey = Object.keys(newData[0]).find(key => key !== "POFRAS Score (0_36)");
                        setSelected(firstKey || "");
                    }
                }
            } catch (err) {
                console.error('Error fetching chart data:', err);
            }
        };

        // Fetch immediately and set up a periodic check (e.g., every 15 seconds)
        fetchAll();
        const fetchInterval = setInterval(fetchAll, 15000); // Check for file updates every 15s

        return () => clearInterval(fetchInterval);
    }, [selected, lastDataLength]); 

    // --------------------------------------------------------
    // 2. Data Plotting (Runs every 5 seconds to simulate streaming)
    // --------------------------------------------------------
    useEffect(() => {
        // Only start the interval if there is data
        if (data.length > 0) {
            const streamInterval = setInterval(() => {
                // *** FIX 2: Check for end-of-data condition ***
                setIndex((i) => {
                    if (i < data.length) {
                        // Advance to the next point
                        return i + 1;
                    } else {
                        // Reached the end of the currently fetched data. Stop advancing.
                        return i; 
                    }
                });
            }, 5000); // Advance one point every 5 seconds

            return () => clearInterval(streamInterval);
        }
    }, [data]); // Re-run whenever a new dataset is fetched

    const chartData = {
        labels: data.slice(0, index).map((_, i) => `T${i + 1}`),
        datasets: [
            {
                label: selected,
                data: data.slice(0, index).map((d) => d[selected]),
                borderColor: '#00796b',
                backgroundColor: 'rgba(0,121,107,0.2)',
                fill: true,
                tension: 0.3,
            },
        ],
    };

    const hasReachedEnd = index >= data.length && data.length > 0;

    return (
        <div className="chart-container">
            <h2>📈 Parameter Trend (Live)</h2>
            <select value={selected} onChange={(e) => setSelected(e.target.value)}>
                {data[0] && Object.keys(data[0])
                    .filter(key => key !== "POFRAS Score (0_36)") // Exclude POFRAS
                    .map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
            </select>
            <Line data={chartData} />

            {/* Display status when streaming is complete for the current dataset */}
            {hasReachedEnd && (
                <p className="stream-status">
                    Streaming paused. Awaiting new data... (Last point plotted: {data.length})
                </p>
            )}
        </div>
    );
}

export default ParameterChart;