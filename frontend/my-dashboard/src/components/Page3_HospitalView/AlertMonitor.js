import React from 'react';
import './AlertMonitor.css';

const AlertMonitor = ({ infantsData }) => {
  const alerts = infantsData.filter(
    (infant) =>
      infant.spo2 < 92 || infant.heartRate < 100 || infant.sucksPerMin < 50
  );

  return (
    <div className="alert-monitor-panel">
      <div className="alert-monitor-header">
        <span className="alarm-symbol">🚨</span>
        <h3>Active Alerts Feed</h3>
      </div>
      
      {alerts.length > 0 ? (
        <ul className="alarm-log-deck">
          {alerts.map((infant) => (
            <li key={infant.id} className="alarm-log-card">
              <div className="alarm-card-header">
                <span className="alarm-patient-name">{infant.name}</span>
                <span className="alarm-badge-pulse">CRITICAL</span>
              </div>
              <div className="alarm-card-details">
                {infant.sucksPerMin < 50 && (
                  <div className="alarm-metric-warn">
                    ⚠️ Sucks Rate: <strong>{infant.sucksPerMin}</strong> /min (Target: 50+)
                  </div>
                )}
                {infant.spo2 < 92 && (
                  <div className="alarm-metric-warn">
                    ⚠️ Oxygen Level: <strong className="text-red">{infant.spo2}%</strong> SpO₂ (Target: 92%+)
                  </div>
                )}
                {infant.heartRate < 115 && (
                  <div className="alarm-metric-warn">
                    ⚠️ Pulse: <strong className="text-red">{infant.heartRate} bpm</strong> (Target: 120-160)
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <div className="alarm-log-stable-prompt">
          <span className="stable-symbol">✓</span>
          <p>All monitored infants stable. No active alerts.</p>
        </div>
      )}
    </div>
  );
};

export default AlertMonitor;
