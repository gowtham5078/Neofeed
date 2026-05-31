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
  Filler
} from 'chart.js';
import './TrendViewer.css';

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

const TrendViewer = ({ infantId }) => {
  // Generate slightly adjusted data points based on infantId for high-fidelity interactive simulation
  const multiplier = (infantId % 3) + 1;
  const suctionData = [-90 - (multiplier * 5), -95 - (multiplier * 2), -85 - (multiplier * 4), -105 - multiplier, -95 - (multiplier * 3), -102 - multiplier];
  const heartRateData = [135 + (multiplier * 3), 140 + multiplier, 138 + (multiplier * 2), 144 + multiplier, 140 + (multiplier * 3), 148 + multiplier];

  const historicalData = {
    labels: ['0m', '10m', '20m', '30m', '40m', '50m'],
    datasets: [
      {
        label: 'Suction Force (mmHg)',
        data: suctionData,
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#06b6d4',
      },
      {
        label: 'Heart Rate (bpm)',
        data: heartRateData,
        borderColor: '#f43f5e',
        backgroundColor: 'rgba(244, 63, 94, 0.08)',
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#f43f5e',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif", size: 9 }
        }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.03)' },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif", size: 9 }
        }
      }
    },
    plugins: {
      legend: {
        labels: {
          color: '#94a3b8',
          boxWidth: 10,
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 10, weight: '700' }
        }
      }
    }
  };

  return (
    <div className="historical-trend-card">
      <div className="trend-card-header">
        <span className="trend-icon">📈</span>
        <h4>Vector Trend Matrix</h4>
      </div>
      <div className="trend-patient-context">
        TRACKING ACTIVE: <span className="context-cyan">NEONATE_#{100 + infantId}</span>
      </div>
      <div className="trend-canvas-viewport">
        <Line data={historicalData} options={chartOptions} />
      </div>
    </div>
  );
};

export default TrendViewer;