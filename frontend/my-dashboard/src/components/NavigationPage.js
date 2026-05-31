import React from 'react';
import { Link } from 'react-router-dom';
import './NavigationPage.css';
import logo from '../assets/images/neonat2.png'; // Path to your logo image

const NavigationPage = () => {
  return (
    <div className="navigation-portal">
      <div className="portal-overlay"></div>
      
      <div className="portal-header">
        <div className="logo-badge-container">
          <img src={logo} alt="NeoFEED Logo" className="portal-logo" />
          <div className="portal-pulse-ring"></div>
        </div>
        <h1 className="portal-title">NeoFEED</h1>
        <p className="portal-subtitle">Next-Gen Intelligent Neonatal Feeding & Health Monitoring System</p>
      </div>

      <div className="portal-grid">
        <Link to="/sensor-data/101" className="portal-card sensor-card-item">
          <div className="card-icon">⚡</div>
          <h2 className="card-title">Live Sensor Stream</h2>
          <p className="card-desc">Monitor real-time physiological telemetry, including Heart Rate, SpO₂ levels, and active suck parameters.</p>
          <div className="card-action">ENTER STREAMING PANEL ➔</div>
          <div className="card-glowing-border cyan"></div>
        </Link>

        <Link to="/ml-engine/101" className="portal-card ml-card-item">
          <div className="card-icon">🧠</div>
          <h2 className="card-title">AI Metric Analysis</h2>
          <p className="card-desc">Apply deep learning models to predict feeding readiness, stability indexes, and evaluate active cardiopulmonary risks.</p>
          <div className="card-action">ENTER AI ENGINE ➔</div>
          <div className="card-glowing-border violet"></div>
        </Link>

        <Link to="/hospital-dashboard" className="portal-card hospital-card-item">
          <div className="card-icon">🏥</div>
          <h2 className="card-title">ICU Hospital Registry</h2>
          <p className="card-desc">Explore multi-infant monitoring grids, real-time clinical alerts, nurse reports, and global ward telemetry logs.</p>
          <div className="card-action">ENTER WARD CONSOLE ➔</div>
          <div className="card-glowing-border emerald"></div>
        </Link>
      </div>

      <div className="portal-footer">
        <span className="footer-system-code">DEVICE_ID: NF-990-X</span>
        <span className="footer-system-status">SECURE PIPELINE ESTABLISHED</span>
      </div>
    </div>
  );
};

export default NavigationPage;
