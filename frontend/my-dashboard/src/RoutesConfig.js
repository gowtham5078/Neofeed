import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SensorView from './components/Page1_SensorView/SensorView';
import Page1 from './components/Page1_SensorView/Page1';
import ModelEngine from './components/Page2_ModelEngine/ModelEngine';
import HospitalDashboard from './components/Page3_HospitalView/HospitalDashboard';
import NavigationPage from './components/NavigationPage';

function RoutesConfig() {
  return (
    <Router>
      <Routes>
        {/* Home/Login */}
        <Route path="/" element={<NavigationPage />} /> {/* Combined Nav Page */}

        <Route path="/" element={<Login />} />

        {/* Dashboard after login */}
        <Route path="/dashboard/:neonateId" element={<Dashboard />} />

        {/* Page 1: Sensor Data */}
        <Route path="/sensor-data/:neonateId" element={<Page1 />} />

        {/* Page 1: Sensor Graph */}
        <Route path="/sensor-graph/:neonateId" element={<SensorView />} />

        {/* Page 2: ML Model Engine */}
        <Route path="/ml-engine/:neonateId" element={<ModelEngine />} />

        {/* Page 3: Hospital Dashboard */}
        <Route path="/hospital-dashboard" element={<HospitalDashboard />} />
      </Routes>
    </Router>
  );
}

export default RoutesConfig;
