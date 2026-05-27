import React from 'react';
import './AlertMonitor.css';

const AlertMonitor = ({ infantsData }) => {
  const alerts = infantsData.filter(
    (infant) =>
      infant.spo2 < 92 || infant.heartRate < 100 || infant.sucksPerMin < 50
  );

  return (
    <div className="alert-monitor">
      <h3>🚨 Feeding Alerts</h3>
      {alerts.length > 0 ? (
        <ul>
          {alerts.map((infant) => (
            <li key={infant.id}>
              Infant <strong>{infant.name}</strong> → {infant.sucksPerMin} sucks/min, {infant.spo2}% SpO₂, {infant.heartRate} bpm.
            </li>
          ))}
        </ul>
      ) : (
        <p>No new alerts at this time ✅</p>
      )}
    </div>
  );
};

export default AlertMonitor;
