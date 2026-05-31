import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const location = useLocation();
  
  // Extract dynamic neonateId or default to 101 if none is present
  const match = location.pathname.match(/\/(?:sensor-data|ml-engine|sensor-graph|dashboard)\/([^/]+)/);
  const neonateId = match ? match[1] : '101';

  return (
    <header className="clinical-header">
      <div className="header-logo-container">
        <Link to="/" className="header-brand-link">
          <span className="logo-symbol">🩺</span>
          <span className="logo-text">NeoFEED</span>
        </Link>
        <div className="status-badge">
          <span className="status-dot"></span>
          <span className="status-label">SYS_ACTIVE</span>
        </div>
      </div>
      
      <nav className="header-navigation">
        <Link 
          to={`/sensor-data/${neonateId}`} 
          className={`nav-item ${location.pathname.startsWith('/sensor-data') ? 'active' : ''}`}
        >
          ⚡ Live Stream
        </Link>
        <Link 
          to={`/ml-engine/${neonateId}`} 
          className={`nav-item ${location.pathname.startsWith('/ml-engine') ? 'active' : ''}`}
        >
          🧠 ML Diagnostics
        </Link>
        <Link 
          to="/hospital-dashboard" 
          className={`nav-item ${location.pathname === '/hospital-dashboard' ? 'active' : ''}`}
        >
          🏥 ICU Registry
        </Link>
        <Link 
          to={`/dashboard/${neonateId}`} 
          className={`nav-item ${location.pathname.startsWith('/dashboard') ? 'active' : ''}`}
        >
          📊 Patient Board
        </Link>
      </nav>

      <div className="header-context">
        <div className="context-label">MONITORING</div>
        <div className="context-value">NEONATE_{neonateId}</div>
      </div>
    </header>
  );
};

export default Header;
