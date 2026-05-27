import React from 'react';
import { useNavigate } from 'react-router-dom';
import './InfantGrid.css';

const InfantGrid = ({ infantsData }) => {
  const navigate = useNavigate();

  return (
    <div className="infant-grid-container">
      <h2>🍼 Infants Overview</h2>
      <table>
        <thead>
          <tr>
            <th>Infant Name</th>
            <th>Feed #</th>
            <th>Suction Pressure</th>
            <th>Tongue Motion</th>
            <th>Comp. Force</th>
            <th>SpO₂</th>
            <th>Heart Rate</th>
            <th>Sucks/min</th>
            <th>Breastfeeds</th>
            <th>Comment</th>
            <th>Further Data</th>
            <th>Child Dashboard</th> {/* New column */}
          </tr>
        </thead>
        <tbody>
          {infantsData.map((infant) => (
            <tr key={infant.id}>
              <td>{infant.name}</td>
              <td>{infant.feedNo}</td>
              <td>{infant.suctionPressure} mmHg</td>
              <td>{infant.tongueMotion}</td>
              <td>{infant.compressiveForce} g</td>
              <td>{infant.spo2} %</td>
              <td>{infant.heartRate} bpm</td>
              <td>{infant.sucksPerMin}</td>
              <td>{infant.breastfeedTimes}</td>
              <td>{infant.comment}</td>
              <td>
                <button
                  onClick={() => navigate(`/ml-engine/101`)}
                >
                  Further Data
                </button>
              </td>
              <td>
                <button
                  onClick={() => navigate(`/dashboard/101`)}
                >
                  Child Dashboard
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InfantGrid;
