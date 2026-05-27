import React, { useState } from 'react';
import './NurseLogin.css';

const NurseLogin = ({ onLoginSuccess }) => {
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate API call to your Flask backend
    if (userId === 'nurse1' && password === 'password') {
      console.log('Login successful');
      onLoginSuccess(userId);
    } else {
      console.log('Login failed');
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>NeoFEED Nurse Login</h2>
        <input 
          type="text" 
          placeholder="User ID" 
          value={userId} 
          onChange={(e) => setUserId(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        <button type="submit">Log In</button>
      </form>
    </div>
  );
};

export default NurseLogin;