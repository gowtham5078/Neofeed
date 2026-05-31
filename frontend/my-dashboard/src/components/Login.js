import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../api';

function Login() {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(userId, password);
      if (res.data.success) {
        navigate(`/dashboard/${res.data.neonateId}`);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('System verification failed. Please check credentials.');
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-container">
        <h2>NeoFEED Console</h2>
        <div className="login-subtitle">SECURE CLINICAL LOG IN PANEL</div>
        
        <div className="login-group">
          <label className="login-label">NEONATE ID / NURSE ID</label>
          <input
            type="text"
            className="login-input"
            placeholder="Enter active ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
        </div>

        <div className="login-group">
          <label className="login-label">SECURITY ACCESS PASSWORD</label>
          <input
            type="password"
            className="login-input"
            placeholder="Enter secure passcode..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button className="login-button" onClick={handleLogin}>
          VERIFY IDENTITY
        </button>

        {error && <div className="login-error-message">⚠️ {error}</div>}

        <div className="login-footer-info">
          RESTRICTED TO AUTHORIZED HOSPITAL PERSONNEL ONLY • SSL_V3
        </div>
      </div>
    </div>
  );
}

export default Login;
