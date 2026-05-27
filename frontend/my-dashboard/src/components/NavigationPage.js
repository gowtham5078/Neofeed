import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationPage.css';
import logo from '../assets/images/neonat2.png'; // ← Path to your logo image

const NavigationPage = () => {
  return (
    <div className="navigation-page">
      <div className="nav-header">
        <img src={logo} alt="NeoFEED Logo" className="nav-logo" />
        <h1>🩺 NeoFEED — Next‑Gen Neonatal Feeding & Health Monitoring System</h1>
      </div>

      <div className="nav-links">
        <Link to="/sensor-data/1" className="nav-button">Sensor Data (Page 1)</Link>
        <Link to="/ml-engine/1" className="nav-button">Metric Analysis (Page 2)</Link>
        <Link to="/hospital-dashboard" className="nav-button">Hospital Dashboard (Page 3)</Link>
      </div>
    </div>
  );
};

export default NavigationPage;
