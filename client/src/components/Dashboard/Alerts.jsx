import React from 'react';

const Alerts = () => {
  // Mock alerts for now, would typically fetch from /api/alerts or specific endpoints
  const alerts = [
    { id: 1, type: 'warning', message: 'Alex: License expires in 18 days' },
    { id: 2, type: 'danger', message: 'Truck TR-202: Maintenance Due Today' },
    { id: 3, type: 'info', message: '3 Vehicles currently In Shop' }
  ];

  return (
    <div className="alerts-container">
      <h3>Active Alerts</h3>
      <div className="alerts-list">
        {alerts.map(alert => (
          <div key={alert.id} className={`alert-card alert-${alert.type}`}>
            <span className="alert-icon">
              {alert.type === 'warning' ? '⚠️' : alert.type === 'danger' ? '🚨' : 'ℹ️'}
            </span>
            <span className="alert-message">{alert.message}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Alerts;
