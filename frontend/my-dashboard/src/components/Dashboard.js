import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNeonateData } from '../api';
import Header from './Header';
import ChartCard from './ChartCard';
import './Dashboard.css';

function Dashboard() {
  const { neonateId } = useParams();
  const [data, setData] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const res = await fetchNeonateData(neonateId);
        setData(res.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };
    loadData();
  }, [neonateId]);

  const extract = (key) => data.map((d) => d[key]);

  return (
    <div className="clinical-dashboard-page">
      <Header />
      
      <main className="dashboard-content">
        <div className="dashboard-title-row">
          <div>
            <h1 className="dashboard-heading">📊 Physiological Telemetry Board</h1>
            <p className="dashboard-subheading">Historical charts of key patient parameters</p>
          </div>
          <div className="dashboard-badge">
            <span className="badge-dot"></span>
            <span>TELEMETRY_RECORD_ACTIVE</span>
          </div>
        </div>

        {data.length > 0 ? (
          <div className="patient-charts-deck">
            <ChartCard title="Heart Rate" data={extract('Heart Rate (bpm)')} label="bpm" type="heart" />
            <ChartCard title="SpO₂ Level" data={extract('SpO2 (%)')} label="%" type="spo2" />
            <ChartCard title="Suction Pressure" data={extract('Suction Pressure (mmHg)')} label="mmHg" type="suction" />
            <ChartCard title="Lip Compression Force" data={extract('Lip Compression Force (g)')} label="g" type="compression" />
          </div>
        ) : (
          <div className="dashboard-loading-prompt">
            <div className="loader-spin"></div>
            <p>Accessing core telemetry logs for Neonate #{neonateId}...</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default Dashboard;
