import React from 'react';
import { AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Alerts = ({ alerts = [] }) => {

  const getAlertIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertTriangle size={18} />;
      case 'danger':
        return <AlertCircle size={18} />;
      case 'info':
      default:
        return <Info size={18} />;
    }
  };

  return (
    <div className="alerts-container">
      <h3>Active Alerts</h3>
      <div className="alerts-list">
        {alerts.length === 0 ? (
          <div className="no-data" style={{ height: 'auto', padding: '2rem 0' }}>No active alerts</div>
        ) : (
          alerts.map(alert => (
            <div key={alert.id} className={`alert-card alert-${alert.type}`}>
              <span className="alert-icon" style={{ opacity: 0.8, marginTop: '0.1rem', display: 'flex' }}>
                {getAlertIcon(alert.type)}
              </span>
              <div className="alert-content" style={{ display: 'flex', flexDirection: 'column' }}>
                <span className="alert-message">{alert.message}</span>
                <span className="alert-time" style={{ fontSize: '0.75rem', color: 'var(--text-secondary, #a1a1aa)', marginTop: '0.25rem' }}>Just now</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Alerts;
