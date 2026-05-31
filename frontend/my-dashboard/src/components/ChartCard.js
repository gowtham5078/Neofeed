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

// Safe component registration
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

function ChartCard({ title, data, label, type }) {
  
  // Neon mapping for physiological vector types
  const typeMeta = {
    heart: { color: '#06b6d4' },
    spo2: { color: '#10b981' },
    suction: { color: '#8b5cf6' },
    compression: { color: '#f43f5e' }
  };

  const meta = typeMeta[type] || { color: '#06b6d4' };

  const chartData = {
    labels: data.map((_, i) => `T${i + 1}`),
    datasets: [
      {
        label,
        data,
        borderColor: meta.color,
        backgroundColor: `${meta.color}15`,
        fill: true,
        tension: 0.35,
        borderWidth: 2,
        pointRadius: 2.5,
        pointBackgroundColor: meta.color,
        pointBorderColor: '#ffffff',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    scales: {
      x: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
        ticks: {
          color: '#64748b',
          font: { family: "'Inter', sans-serif", size: 9 }
        }
      },
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.04)' },
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
          font: { family: "'Plus Jakarta Sans', sans-serif", size: 10, weight: '700' }
        }
      }
    }
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <div style={{ position: 'relative', height: '220px', width: '100%' }}>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
}

export default ChartCard;
