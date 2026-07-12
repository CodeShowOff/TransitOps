import React from 'react';
import useAuth from '../../hooks/useAuth';
import './Settings.css';

const Settings = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleExportCSV = () => {
    window.location.href = '/analytics';
  };

  const handleRefresh = () => {
    window.location.href = '/dashboard';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>System Settings</h1>
      </div>

      <div className="settings-layout">
        
        {/* Section 1: Company Information */}
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

        {/* Section 2: Preferences */}
        <div className="settings-section">
          <h3>Preferences</h3>
          <div className="settings-card">
            <div className="settings-row">
              <span className="settings-label">Theme</span>
              <div className="theme-toggle">
                <button className="theme-btn active" disabled>
                  <span className="icon">☀️</span> Light
                </button>
                <button className="theme-btn disabled" disabled>
                  <span className="icon">🌙</span> Dark
                  <span className="coming-soon">Coming Soon</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Account */}
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

        {/* Section 4: About */}
        <div className="settings-section">
          <h3>About</h3>
          <div className="settings-card about-card">
            <h4>TransitOps</h4>
            <p>Version 1.0</p>
            <p className="hackathon-badge">Hackathon Project</p>
            <div className="built-with">
              <span>Built with:</span>
              <div className="tech-stack">
                <span className="tech-badge">React</span>
                <span className="tech-badge">Node</span>
                <span className="tech-badge">Express</span>
                <span className="tech-badge">MongoDB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: Quick Actions */}
        <div className="settings-section">
          <h3>Quick Actions</h3>
          <div className="settings-card quick-actions">
            <button className="btn-secondary" onClick={handleExportCSV}>Export CSV</button>
            <button className="btn-secondary" onClick={handleRefresh}>Refresh Dashboard</button>
            <button className="btn-danger" onClick={handleLogout}>Logout</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
