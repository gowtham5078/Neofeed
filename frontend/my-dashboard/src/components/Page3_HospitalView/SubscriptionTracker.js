import React from 'react';
import './SubscriptionTracker.css';

const SubscriptionTracker = () => {
  const subscriptionStatus = {
    plan: 'Premium Hospital',
    status: 'Active',
    expires: '2026-09-27',
  };

  return (
    <div className="subscription-tracker">
      <h3>⭐ Subscription Status</h3>
      <p><strong>Plan:</strong> {subscriptionStatus.plan}</p>
      <p><strong>Status:</strong> {subscriptionStatus.status}</p>
      <p><strong>Expires:</strong> {subscriptionStatus.expires}</p>
    </div>
  );
};

export default SubscriptionTracker;
