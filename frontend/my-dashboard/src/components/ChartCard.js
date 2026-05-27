import React from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, LineElement, PointElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(LineElement, PointElement, CategoryScale, LinearScale);

function ChartCard({ title, data, label }) {
  const chartData = {
    labels: data.map((_, i) => i + 1),
    datasets: [
      {
        label,
        data,
        borderColor: 'rgba(75,192,192,1)',
        backgroundColor: 'rgba(75,192,192,0.2)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="chart-card">
      <h3>{title}</h3>
      <Line data={chartData} />
    </div>
  );
}

export default ChartCard;
