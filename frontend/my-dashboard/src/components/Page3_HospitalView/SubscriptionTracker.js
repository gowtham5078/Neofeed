import React from 'react';
import './SubscriptionTracker.css';

const SubscriptionTracker = () => {
  const subscriptionStatus = {
    plan: 'PREMIUM ICU SYSTEM',
    status: 'AUTHENTICATED',
    expires: '2026-09-27',
  };

  return (
    <div className="subscription-card-badge">
      <div className="card-badge-glow"></div>
      <div className="badge-header-line">
        <span className="badge-chip">🔑</span>
        <span className="badge-status-glow">{subscriptionStatus.status}</span>
      </div>
      <div className="badge-details-block">
        <div className="badge-plan-title">{subscriptionStatus.plan}</div>
        <div className="badge-expiration-info">
          <span>PIPELINE VALID THROUGH:</span>
          <strong>{subscriptionStatus.expires}</strong>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTracker;
