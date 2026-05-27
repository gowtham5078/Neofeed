import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import './SensorView.css';

function SensorView() {
    const [index, setIndex] = useState(0);
    const [data, setData] = useState({});
    const [timestamp, setTimestamp] = useState('00:00');
    const [error, setError] = useState('');

    // Use a ref to hold the index state so the interval doesn't rely on it
    const indexRef = useRef(0); 

    const formatTimestamp = (seconds) => {
        const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    // ----------------------------------------------------------------------
    // Main Streaming Logic: Fetches data for the current index and handles end-of-file
    // ----------------------------------------------------------------------
    const fetchRow = async (currentIndex) => {
        try {
            // Attempt to fetch the next row
            const res = await axios.get(`http://127.0.0.1:5000/api/stream/${currentIndex}`);
            
            // Success: Update state and advance ref
            setData(res.data);
            setTimestamp(formatTimestamp(currentIndex * 5)); // 5s interval simulation
            setError('');
            indexRef.current = currentIndex;

        } catch (err) {
            // Error (likely a 404 because the index is out of range)
            if (err.response && err.response.status === 404) {
                // Keep the last known data and show a 'waiting' status
                setError('Stream paused. Awaiting new data in the file...');
            } else {
                // Display a true error (e.g., server down)
                setError('Error fetching data. Check server connection.');
            }
        }
    };

    // ----------------------------------------------------------------------
    // Interval Management: Runs every 5s to trigger the next fetch
    // ----------------------------------------------------------------------
    useEffect(() => {
        // Run the fetch immediately to get the first row (index 0)
        fetchRow(indexRef.current);

        // Set the interval to fetch the next index every 5 seconds
        const interval = setInterval(() => {
            const nextIndex = indexRef.current + 1;
            
            // Trigger the fetch. The success/failure logic handles the state and indexRef update.
            fetchRow(nextIndex);
            
            // Crucial: Update the component's visible index state to force a re-render 
            // after the fetch logic has completed.
            setIndex(nextIndex); 
            
        }, 5000); // 5000 ms = 5 seconds

        // Cleanup: Clear the interval when the component unmounts
        return () => clearInterval(interval);
        
    }, []); // Empty dependency array: runs only once on mount

    return (
        <div className="sensor-container">
            <h2>🩺 NeoFEED Live Sensor Stream</h2>
            <p className="timestamp">
                ⏱️ Timestamp: {timestamp} (Row {indexRef.current + 1})
            </p>
            {error ? (
                <p className="error">{error}</p>
            ) : (
                <div className="sensor-card">
                    {Object.entries(data)
                        .filter(([key]) => key !== "POFRAS Score (0_36)") // Exclude POFRAS
                        .map(([key, value]) => (
                            <div key={key} className="sensor-row">
                                <span className="sensor-label">{key}</span>
                                <span className="sensor-value">{value}</span>
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
}

export default SensorView;