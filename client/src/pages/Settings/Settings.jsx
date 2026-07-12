import React from 'react';
import useAuth from '../../hooks/useAuth';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="page-container">
      <div className="page-header" style={{ marginBottom: '1.5rem', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color, rgba(255, 255, 255, 0.08))' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>System Settings</h1>
      </div>

      <div className="settings-layout">
        
        {/* Section 1: Account */}
        <div className="settings-section">
          <h3>Account</h3>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Name</span>
              <span className="settings-value">{user?.name || 'N/A'}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Email</span>
              <span className="settings-value">{user?.email || 'N/A'}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Role</span>
              <span className="settings-value role-badge">{user?.role || 'N/A'}</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Last Login</span>
              <span className="settings-value">Today</span>
            </div>
          </div>
        </div>

        {/* Section 2: Company Information */}
        <div className="settings-section">
          <h3>Company Information</h3>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Company Name</span>
              <span className="settings-value">TransitOps Logistics</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Fleet Size</span>
              <span className="settings-value">25 Vehicles</span>
            </div>
            <div className="settings-row">
              <span className="settings-label">Current Version</span>
              <span className="settings-value">v1.0</span>
            </div>
          </div>
        </div>

        {/* Section 3: Preferences */}
        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Theme</span>
              <div className="theme-toggle">
                <button className="theme-btn disabled" disabled>
                  <span className="icon">☀️</span> Light
                  <span className="coming-soon">Coming Soon</span>
                </button>
                <button className="theme-btn active" disabled>
                  <span className="icon">🌙</span> Dark
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
