import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import SensorView from './components/Page1_SensorView/SensorView';
import Page1 from './components/Page1_SensorView/Page1';
import ModelEngine from './components/Page2_ModelEngine/ModelEngine';
import HospitalDashboard from './components/Page3_HospitalView/HospitalDashboard';
import NavigationPage from './components/NavigationPage';

// --------------------------------------------------
// ProtectedRoute — redirects to / if no token found
// --------------------------------------------------
function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/" replace />;
  }
  return children;
}

function RoutesConfig() {
  return (
    <Router>
      <Routes>

        {/* Public — login only */}
        <Route path="/" element={<Login />} />

        {/* Protected — must be logged in */}
        <Route path="/home" element={
          <ProtectedRoute><NavigationPage /></ProtectedRoute>
        } />

        <Route path="/dashboard/:neonateId" element={
          <ProtectedRoute><Dashboard /></ProtectedRoute>
        } />

        <Route path="/sensor-data/:neonateId" element={
          <ProtectedRoute><Page1 /></ProtectedRoute>
        } />

        <Route path="/sensor-graph/:neonateId" element={
          <ProtectedRoute><SensorView /></ProtectedRoute>
        } />

        <Route path="/ml-engine/:neonateId" element={
          <ProtectedRoute><ModelEngine /></ProtectedRoute>
        } />

        <Route path="/hospital-dashboard" element={
          <ProtectedRoute><HospitalDashboard /></ProtectedRoute>
        } />

        {/* Catch-all — redirect unknown paths to login */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default RoutesConfig;
