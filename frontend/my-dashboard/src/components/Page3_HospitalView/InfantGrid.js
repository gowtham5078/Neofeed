import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfantGrid.css';

const InfantGrid = ({ infantsData, selectedId, onSelect }) => {
  const navigate = useNavigate();

  const isAlertState = (infant) => {
    return infant.spo2 < 92 || infant.heartRate < 100 || infant.sucksPerMin < 50;
  };

  return (
    <div className="infant-registry-panel">
      <div className="registry-header">
        <h2>🍼 Ward Patients Overview</h2>
        <span className="registry-system-indicator">ACTIVE_MONITORS</span>
      </div>

      <div className="registry-table-scroll">
        <table className="clinical-registry-table">
          <thead>
            <tr>
              <th>PATIENT</th>
              <th>FEED #</th>
              <th>SUCTION</th>
              <th>TONGUE</th>
              <th>COMPRESS</th>
              <th>SpO₂</th>
              <th>HEART RATE</th>
              <th>SUCKS/MIN</th>
              <th>BREASTFEEDS</th>
              <th>DIAGNOSTIC STATUS</th>
              <th>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {infantsData.map((infant) => {
              const selected = infant.id === selectedId;
              const critical = isAlertState(infant);

              return (
                <tr 
                  key={infant.id}
                  className={`registry-row ${selected ? 'row-active' : ''} ${critical ? 'row-critical' : ''}`}
                  onMouseEnter={() => onSelect(infant.id)}
                  onClick={() => onSelect(infant.id)}
                >
                  <td className="patient-identity-cell">
                    <span className="patient-avatar">👶</span>
                    <div className="patient-details-col">
                      <span className="patient-name">{infant.name}</span>
                      <span className="patient-id">ID: #{100 + infant.id}</span>
                    </div>
                  </td>
                  <td>{infant.feedNo}</td>
                  <td className="num-cell">{infant.suctionPressure} <span className="cell-unit">mmHg</span></td>
                  <td>{infant.tongueMotion}</td>
                  <td className="num-cell">{infant.compressiveForce} <span className="cell-unit">g</span></td>
                  <td className={`num-cell ${infant.spo2 < 92 ? 'text-red font-bold' : 'text-teal font-bold'}`}>
                    {infant.spo2}%
                  </td>
                  <td className={`num-cell ${infant.heartRate < 100 ? 'text-red font-bold' : ''}`}>
                    {infant.heartRate} <span className="cell-unit">bpm</span>
                  </td>
                  <td className="num-cell">{infant.sucksPerMin}</td>
                  <td>{infant.breastfeedTimes}</td>
                  <td className="comment-cell">
                    <div className="status-indicator-block">
                      <span className={`status-led ${critical ? 'red' : 'green'}`}></span>
                      <span className="comment-text">{infant.comment}</span>
                    </div>
                  </td>
                  <td>
                    <div className="registry-actions-group">
                      <button
                        className="registry-btn violet"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/ml-engine/${100 + infant.id}`);
                        }}
                      >
                        🧠 AI Report
                      </button>
                      <button
                        className="registry-btn cyan"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/dashboard/${100 + infant.id}`);
                        }}
                      >
                        ⚡ Telemetry
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InfantGrid;
