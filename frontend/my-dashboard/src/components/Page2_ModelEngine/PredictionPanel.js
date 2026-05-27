import React, { useState } from 'react';
import './PredictionPanel.css';
import trainingVideo from '../../assets/images/video1.mp4';

function PredictionPanel({ result }) {
  const [showVideo, setShowVideo] = useState(false);

  const handleVideoClick = () => {
    setShowVideo(!showVideo);
  };

  return (
    <div className="one">
    <div className="prediction-panel">
      <h3>🧾 Infant  {result.chunk_start} – {result.chunk_end}</h3>

      <table className="prediction-table">
        <tbody>
          {/* POFRAS Score */}
          <tr>
            <th>Avg POFRAS Score</th>
            <td>{result.avg_pofras}</td>
          </tr>

          {/* Prediction Confidence */}
          <tr className="section-header">
            <th colSpan="2">📈 Prediction Confidence</th>
          </tr>
          <tr>
            <th>Avg Confidence</th>
            <td>{result.avg_confidence}</td>
          </tr>
          <tr>
            <th>Avg CI Lower</th>
            <td>{result.avg_ci_lower}</td>
          </tr>
          <tr>
            <th>Avg CI Upper</th>
            <td>{result.avg_ci_upper}</td>
          </tr>
          <tr>
            <th>Avg Observation Lower</th>
            <td>{result.avg_obs_lower}</td>
          </tr>
          <tr>
            <th>Avg Observation Upper</th>
            <td>{result.avg_obs_upper}</td>
          </tr>

          {/* Feeding Readiness */}
          <tr className="section-header">
            <th colSpan="2">⏰ Feeding Readiness</th>
          </tr>
          <tr>
            <th>Avg Time to Feed</th>
            <td>{result.avg_time_to_feed} days</td>
          </tr>

          {/* Suction Metrics */}
          <tr className="suction-metrics-header">
            <th colSpan="2">💡 Suction Metrics</th>
          </tr>
          <tr>
            <th>Avg Sucks per Min</th>
            <td>{result.avg_sucks_per_min}</td>
          </tr>
          <tr>
            <th>Avg Inter-suck Interval</th>
            <td>{result.avg_inter_suck_interval} sec</td>
          </tr>
          <tr>
            <th>Avg Max Suck Pressure</th>
            <td>{result.avg_max_suck_pressure} mmHg</td>
          </tr>

          {/* Lagging Parameters */}
          {result.lagging_params && result.lagging_params.length > 0 && (
            <>
              <tr className="section-header">
                <th colSpan="2">⚠️ Lagging Parameters</th>
              </tr>
              <tr>
                <th>Parameters</th>
                <td>
                  <ul className="alerts-list">
                    {result.lagging_params.map((param, idx) => (
                      <li key={idx}>{param}</li>
                    ))}
                  </ul>
                </td>
              </tr>

              {/* Click-to-play Training Video */}
              <tr className="section-header">
                <th colSpan="2">🎥 Training Video</th>
              </tr>
              <tr>
                <td colSpan="2" style={{ textAlign: "center" }}>
                  {!showVideo ? (
                    <button
                      className="video-toggle-button"
                      onClick={handleVideoClick}
                    >
                      ▶️ Video Demo
                    </button>
                  ) : (
                    <video width="100%" controls>
                      <source src={trainingVideo} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  )}
                </td>
              </tr>
            </>
          )}

          {/* Cardiopulmonary Status */}
          <tr className="cardiopulmonary-header">
            <th colSpan="2">🚨 Cardiopulmonary Status & Alerts</th>
          </tr>
          <tr>
            <th>Status</th>
            <td style={{ color: result.cps_status === "Stable" ? "green" : "red" }}>
              {result.cps_status}
            </td>
          </tr>
          {result.cps_alerts && result.cps_alerts.length > 0 && (
            <tr>
              <th>Alerts</th>
              <td>
                <ul className="alerts-list">
                  {result.cps_alerts.map((alert, index) => (
                    <li key={index}>{alert}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
          {result.cps_unstable_params && result.cps_unstable_params.length > 0 && (
            <tr>
              <th>Unstable Parameters</th>
              <td>
                <ul className="alerts-list">
                  {result.cps_unstable_params.map((param, idx) => (
                    <li key={idx}>{param}</li>
                  ))}
                </ul>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
    </div>
  );
}

export default PredictionPanel;
