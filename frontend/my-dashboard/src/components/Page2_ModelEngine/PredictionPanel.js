import React, { useState } from 'react';
import './PredictionPanel.css';
import trainingVideo from '../../assets/images/video1.mp4';

function PredictionPanel({ result }) {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoClick = () => {
    setShowVideo(!showVideo);
  };

  // Convert confidence to simple percent value for visual styling
  const confidencePercent = Math.min(Math.max(parseFloat(result.avg_confidence) * 100 || 0, 0), 100).toFixed(0);

  return (
    <div className="prediction-report-card">
      {/* Top Header */}
      <div className="report-card-header">
        <div className="report-title-block">
          <span className="report-icon">🧾</span>
          <h3>Infant Group {result.chunk_start} – {result.chunk_end}</h3>
        </div>
        <div className={`cps-status-badge ${result.cps_status === "Stable" ? "stable" : "critical"}`}>
          <span className="cps-status-dot"></span>
          <span>{result.cps_status.toUpperCase()}</span>
        </div>
      </div>

      <div className="report-grid-layout">
        {/* Box 1: Core AI Feeding Readiness */}
        <div className="report-sub-card primary-assessment">
          <div className="sub-card-label">⏰ ASSESSMENT</div>
          <h4 className="sub-card-heading">Feeding Readiness</h4>
          <div className="readiness-vital-value">
            <span className="readiness-number">{result.avg_time_to_feed}</span>
            <span className="readiness-unit">DAYS TO FEED</span>
          </div>
          <div className="pofras-metric">
            <span>Avg POFRAS Score:</span>
            <strong>{result.avg_pofras}</strong>
          </div>
        </div>

        {/* Box 2: Prediction Confidence Diagnostics */}
        <div className="report-sub-card confidence-assessment">
          <div className="sub-card-label">📈 DIAGNOSTICS</div>
          <h4 className="sub-card-heading">Prediction Confidence</h4>
          
          <div className="confidence-meter-container">
            <div className="confidence-meter-header">
              <span>Avg Confidence</span>
              <strong>{confidencePercent}%</strong>
            </div>
            <div className="confidence-progress-bar-bg">
              <div className="confidence-progress-bar-fill" style={{ width: `${confidencePercent}%` }}></div>
            </div>
          </div>

          <div className="confidence-ranges">
            <div className="range-item">
              <span>CI Lower:</span>
              <strong>{result.avg_ci_lower}</strong>
            </div>
            <div className="range-item">
              <span>CI Upper:</span>
              <strong>{result.avg_ci_upper}</strong>
            </div>
            <div className="range-item">
              <span>Obs Lower:</span>
              <strong>{result.avg_obs_lower}</strong>
            </div>
            <div className="range-item">
              <span>Obs Upper:</span>
              <strong>{result.avg_obs_upper}</strong>
            </div>
          </div>
        </div>

        {/* Box 3: Physiological Suction Metrics */}
        <div className="report-sub-card telemetry-assessment">
          <div className="sub-card-label">💡 PHYSIOLOGY</div>
          <h4 className="sub-card-heading">Active Suction Metrics</h4>
          
          <div className="telemetry-compact-rows">
            <div className="telemetry-compact-row">
              <span className="telemetry-row-label">💨 Sucks per Min:</span>
              <strong className="telemetry-row-value cyan">{result.avg_sucks_per_min}</strong>
            </div>
            <div className="telemetry-compact-row">
              <span className="telemetry-row-label">⏱️ Inter-suck Interval:</span>
              <strong className="telemetry-row-value amber">{result.avg_inter_suck_interval} sec</strong>
            </div>
            <div className="telemetry-compact-row">
              <span className="telemetry-row-label">🌀 Max Suck Pressure:</span>
              <strong className="telemetry-row-value violet">{result.avg_max_suck_pressure} mmHg</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Lagging Variables & Clinical Alarm section */}
      {(result.lagging_params && result.lagging_params.length > 0) || 
       (result.cps_alerts && result.cps_alerts.length > 0) ||
       (result.cps_unstable_params && result.cps_unstable_params.length > 0) ? (
        <div className="report-clinical-alerts-panel">
          <div className="panel-title">🚨 ACTIVE PHYSIOLOGICAL ALERTS</div>
          <div className="panel-alert-deck">
            {result.lagging_params && result.lagging_params.length > 0 && (
              <div className="panel-alert-item">
                <div className="alert-item-label">⚠️ LAGGING PARAMETERS</div>
                <ul className="alerts-pill-list">
                  {result.lagging_params.map((param, idx) => (
                    <li key={idx} className="alert-pill">{param}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {result.cps_alerts && result.cps_alerts.length > 0 && (
              <div className="panel-alert-item">
                <div className="alert-item-label">🛑 CARDIO-RESPIRATORY ALERTS</div>
                <ul className="alerts-pill-list text-red">
                  {result.cps_alerts.map((alert, idx) => (
                    <li key={idx} className="alert-pill border-rose">{alert}</li>
                  ))}
                </ul>
              </div>
            )}

            {result.cps_unstable_params && result.cps_unstable_params.length > 0 && (
              <div className="panel-alert-item">
                <div className="alert-item-label">⚠️ UNSTABLE CRITICAL PARAMETERS</div>
                <ul className="alerts-pill-list text-amber">
                  {result.cps_unstable_params.map((param, idx) => (
                    <li key={idx} className="alert-pill border-amber">{param}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      ) : null}

      {/* Embedded training Video action */}
      {result.lagging_params && result.lagging_params.length > 0 && (
        <div className="report-clinical-video-section">
          <div className="video-section-header">
            <span>🎥 Oral Motor Intervention Training Demo</span>
            <button className="premium-action-btn" onClick={handleVideoClick}>
              {showVideo ? 'CLOSE DEMO PLAYER' : '▶ LAUNCH VIDEO PLAYER'}
            </button>
          </div>
          {showVideo && (
            <div className="video-player-frame">
              <video width="100%" controls className="premium-embedded-video">
                <source src={trainingVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default PredictionPanel;
