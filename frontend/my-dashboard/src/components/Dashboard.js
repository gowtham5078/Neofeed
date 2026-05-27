import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchNeonateData } from '../api';
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
    <body>
    <div className="dashboard">
      <h2>NeoFEED Dashboard - Neonate {neonateId}</h2>
      <div className="charts">
        <ChartCard title="Heart Rate" data={extract('Heart Rate (bpm)')} label="bpm" />
        <ChartCard title="SpO2" data={extract('SpO2 (%)')} label="%" />
        <ChartCard title="Suction Pressure" data={extract('Suction Pressure (mmHg)')} label="mmHg" />
        <ChartCard title="Lip Compression Force" data={extract('Lip Compression Force (g)')} label="g" />
      </div>
    </div>
    </body>
  );
}

export default Dashboard;
