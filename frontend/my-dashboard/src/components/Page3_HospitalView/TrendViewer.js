import React from 'react';
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
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Simulated historical data for one infant
const historicalData = {
  labels: ['0m', '1m', '2m', '3m', '4m', '5m'],
  datasets: [
    {
      label: 'Suction Pressure (mmHg)',
      data: [-95, -100, -85, -110, -98, -105],
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
    {
      label: 'Heart Rate (bpm)',
      data: [140, 142, 138, 145, 141, 150],
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
  ],
};

const TrendViewer = ({ infantId }) => {
  return (
    <div className="trend-viewer-container">
      <h2>Detailed Trends for Infant {infantId}</h2>
      <Line data={historicalData} />
      {/* Additional tables or metrics can be added here */}
    </div>
  );
};

export default TrendViewer;