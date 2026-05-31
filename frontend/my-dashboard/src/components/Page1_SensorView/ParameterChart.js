import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './SensorView.css';

// Safely register chart components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function ParameterChart() {
    const [data, setData] = useState([]);
    const [selected, setSelected] = useState('');
    const [index, setIndex] = useState(0); 
    const [lastDataLength, setLastDataLength] = useState(0);

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const res = await axios.get('http://127.0.0.1:5000/api/data/101');
                const newData = res.data;

                if (newData.length > lastDataLength) {
                    setData(newData);
                    setLastDataLength(newData.length);
                    
                    if (!selected && newData.length > 0) {
                        const firstKey = Object.keys(newData[0]).find(key => key !== "POFRAS Score (0_36)");
                        setSelected(firstKey || "");
                    }
                }
            } catch (err) {
                console.error('Error fetching chart data:', err);
            }
        };

        fetchAll();
        const fetchInterval = setInterval(fetchAll, 15000); 

        return () => clearInterval(fetchInterval);
    }, [selected, lastDataLength]); 

    useEffect(() => {
        if (data.length > 0) {
            const streamInterval = setInterval(() => {
                setIndex((i) => {
                    if (i < data.length) {
                        return i + 1;
                    } else {
                        return i; 
                    }
                });
            }, 5000); 

            return () => clearInterval(streamInterval);
        }
    }, [data]); 

    // Neon accent colors based on selected parameter
    const getNeonColor = (param) => {
        if (param.includes('Heart')) return '#06b6d4'; // Cyan
        if (param.includes('SpO2')) return '#10b981';  // Teal
        if (param.includes('Suction')) return '#8b5cf6'; // Violet
        if (param.includes('Latch')) return '#f59e0b';   // Amber
        return '#f43f5e'; // Rose for lip pressure/other
    };

    const neonColor = getNeonColor(selected);

    const chartData = {
        labels: data.slice(0, index).map((_, i) => `T${i + 1}`),
        datasets: [
            {
                label: selected,
                data: data.slice(0, index).map((d) => d[selected]),
                borderColor: neonColor,
                backgroundColor: `${neonColor}18`, // Subtle alpha transparency
                fill: true,
                tension: 0.3,
                borderWidth: 2.5,
                pointRadius: 4,
                pointBackgroundColor: neonColor,
                pointBorderColor: '#ffffff',
                pointHoverRadius: 6,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        scales: {
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 10
                    }
                }
            },
            y: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.05)',
                },
                ticks: {
                    color: '#94a3b8',
                    font: {
                        family: "'Inter', sans-serif",
                        size: 10
                    }
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: '#ffffff',
                    font: {
                        family: "'Plus Jakarta Sans', sans-serif",
                        weight: '700'
                    }
                }
            }
        }
    };

    const hasReachedEnd = index >= data.length && data.length > 0;

    return (
        <div className="chart-container">
            <h2>📈 Parameter Trend Matrix</h2>
            <select 
                className="telemetry-chart-select"
                value={selected} 
                onChange={(e) => setSelected(e.target.value)}
            >
                {data[0] && Object.keys(data[0])
                    .filter(key => key !== "POFRAS Score (0_36)") 
                    .map((key) => (
                        <option key={key} value={key}>{key}</option>
                    ))}
            </select>
            <Line data={chartData} options={chartOptions} />

            {hasReachedEnd && (
                <p className="stream-status">
                    PULSE STABLE • Feed completed or stream awaiting next data frame...
                </p>
            )}
        </div>
    );
}

export default ParameterChart;