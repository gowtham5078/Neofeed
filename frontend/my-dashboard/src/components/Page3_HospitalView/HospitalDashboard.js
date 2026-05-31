import React, { useState } from 'react';
import Header from '../Header';
import InfantGrid from './InfantGrid';
import AlertMonitor from './AlertMonitor';
import TrendViewer from './TrendViewer';
import SubscriptionTracker from './SubscriptionTracker';
import './HospitalDashboard.css';

// Simulated infant data (shared across dashboard components)
const infantsData = [
  { id: 1, name: 'Infant A', feedNo: 3, suctionPressure: -95, tongueMotion: 0.8, compressiveForce: 45, spo2: 98, heartRate: 140, sucksPerMin: 62, breastfeedTimes: 3, comment: 'Stable feeding session.', furtherData: 'link' },
  { id: 2, name: 'Infant B', feedNo: 2, suctionPressure: -70, tongueMotion: 0.6, compressiveForce: 30, spo2: 95, heartRate: 155, sucksPerMin: 58, breastfeedTimes: 2, comment: 'Slightly disorganized suck.', furtherData: 'link' },
  { id: 3, name: 'Infant C', feedNo: 4, suctionPressure: -50, tongueMotion: 0.4, compressiveForce: 20, spo2: 89, heartRate: 170, sucksPerMin: 45, breastfeedTimes: 1, comment: 'Weak suck, desaturation risk.', furtherData: 'link' },
  { id: 4, name: 'Infant D', feedNo: 1, suctionPressure: -110, tongueMotion: 0.9, compressiveForce: 55, spo2: 99, heartRate: 135, sucksPerMin: 68, breastfeedTimes: 1, comment: 'Excellent feeding rhythm.', furtherData: 'link' },
  { id: 5, name: 'Infant E', feedNo: 5, suctionPressure: -85, tongueMotion: 0.7, compressiveForce: 38, spo2: 96, heartRate: 148, sucksPerMin: 60, breastfeedTimes: 4, comment: 'Consistent performance.', furtherData: 'link' },
  { id: 6, name: 'Infant F', feedNo: 2, suctionPressure: -65, tongueMotion: 0.5, compressiveForce: 25, spo2: 91, heartRate: 165, sucksPerMin: 52, breastfeedTimes: 0, comment: 'Short bursts, signs of fatigue.', furtherData: 'link' },
  { id: 7, name: 'Infant G', feedNo: 3, suctionPressure: -105, tongueMotion: 0.85, compressiveForce: 50, spo2: 98, heartRate: 142, sucksPerMin: 65, breastfeedTimes: 3, comment: 'Strong, rhythmic suck.', furtherData: 'link' },
  { id: 8, name: 'Infant H', feedNo: 1, suctionPressure: -45, tongueMotion: 0.3, compressiveForce: 18, spo2: 87, heartRate: 110, sucksPerMin: 35, breastfeedTimes: 0, comment: 'Poor suction, low heart rate.', furtherData: 'link' },
  { id: 9, name: 'Infant I', feedNo: 4, suctionPressure: -90, tongueMotion: 0.75, compressiveForce: 42, spo2: 97, heartRate: 150, sucksPerMin: 61, breastfeedTimes: 4, comment: 'Good progress.', furtherData: 'link' },
  { id: 10, name: 'Infant J', feedNo: 2, suctionPressure: -75, tongueMotion: 0.65, compressiveForce: 35, spo2: 93, heartRate: 160, sucksPerMin: 55, breastfeedTimes: 1, comment: 'Slightly slow rhythm.', furtherData: 'link' },
];

const HospitalDashboard = () => {
  const [selectedInfantId, setSelectedInfantId] = useState(1);

  // Dynamic KPI Calculations
  const totalMonitored = infantsData.length;
  const criticalAlerts = infantsData.filter(
    (infant) => infant.spo2 < 92 || infant.heartRate < 100 || infant.sucksPerMin < 50
  ).length;
  const stableCount = totalMonitored - criticalAlerts;

  const handleInfantSelect = (id) => {
    setSelectedInfantId(id);
  };

  return (
    <div className="hospital-dashboard-container">
      <Header />
      
      <main className="dashboard-content-layout">
        
        {/* Dynamic Clinical KPI Row */}
        <section className="clinical-kpi-bar">
          <div className="kpi-panel cyan">
            <div className="kpi-icon">🍼</div>
            <div className="kpi-data">
              <span className="kpi-label">TOTAL MONITORED</span>
              <span className="kpi-value">{totalMonitored}</span>
            </div>
            <div className="kpi-spark cyan"></div>
          </div>
          
          <div className="kpi-panel rose">
            <div className="kpi-icon">🚨</div>
            <div className="kpi-data">
              <span className="kpi-label">ACTIVE ALERTS</span>
              <span className="kpi-value pulse-number">{criticalAlerts}</span>
            </div>
            <div className="kpi-spark rose"></div>
          </div>
          
          <div className="kpi-panel emerald">
            <div className="kpi-icon">💖</div>
            <div className="kpi-data">
              <span className="kpi-label">STABLE STATUS</span>
              <span className="kpi-value">{stableCount}</span>
            </div>
            <div className="kpi-spark emerald"></div>
          </div>
        </section>

        {/* Multi-Column Layout */}
        <div className="dashboard-grid-layout">
          <div className="main-registry-area">
            <InfantGrid 
              infantsData={infantsData} 
              selectedId={selectedInfantId}
              onSelect={handleInfantSelect}
            />
          </div>
          
          <aside className="ward-sidebar-area">
            <AlertMonitor infantsData={infantsData} />
            <TrendViewer infantId={selectedInfantId} />
            <SubscriptionTracker />
          </aside>
        </div>

      </main>
    </div>
  );
};

export default HospitalDashboard;
