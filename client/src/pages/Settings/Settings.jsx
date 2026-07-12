import React, { useState } from 'react';
import useAuth from '../../hooks/useAuth';
import './Settings.css';

const Settings = () => {
  const { user } = useAuth();

  const [depotName, setDepotName] = useState('Gandhinagar Depot GJ4');
  const [currency, setCurrency] = useState('INR (Rs)');
  const [distanceUnit, setDistanceUnit] = useState('Kilometers');

  const handleSave = () => {
    console.log('Saved settings:', { depotName, currency, distanceUnit });
  };

  const rbacData = [
    { role: 'Fleet Manager', fleet: '✓', drivers: '✓', trips: '✓', fuel: '✓', analytics: '✓' },
    { role: 'Dispatcher', fleet: 'View', drivers: 'View', trips: '✓', fuel: '✓', analytics: '-' },
    { role: 'Safety Officer', fleet: 'View', drivers: '✓', trips: 'View', fuel: '-', analytics: '-' },
    { role: 'Financial Analyst', fleet: 'View', drivers: 'View', trips: 'View', fuel: 'View', analytics: '✓' }
  ];

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
        {user?.role === 'Fleet Manager' && (
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
        )}

        {/* Bottom Row: General & RBAC */}
        <div className="settings-bottom-row">
          {/* Section 4: General Operations Settings */}
          {user?.role === 'Fleet Manager' && (
            <div className="settings-section">
              <h3>General Operations</h3>
              <div className="settings-card form-layout">
                <div className="form-group">
                  <label>DEPOT NAME</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={depotName} 
                    onChange={(e) => setDepotName(e.target.value)} 
                  />
                </div>
                
                <div className="form-group">
                  <label>CURRENCY</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={currency} 
                    onChange={(e) => setCurrency(e.target.value)} 
                  />
                </div>
                
                <div className="form-group">
                  <label>DISTANCE UNIT</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={distanceUnit} 
                    onChange={(e) => setDistanceUnit(e.target.value)} 
                  />
                </div>

                <button className="save-btn" onClick={handleSave}>Save changes</button>
              </div>
            </div>
          )}

          {/* Section 5: Role-Based Access (RBAC) */}
          <div className="settings-section">
            <h3>Role-Based Access (RBAC)</h3>
            <div className="settings-card rbac-card">
              <div className="rbac-table-container">
                <table className="rbac-table">
                  <thead>
                    <tr>
                      <th>ROLE</th>
                      <th>FLEET</th>
                      <th>DRIVERS</th>
                      <th>TRIPS</th>
                      <th>FUEL/EXP.</th>
                      <th>ANALYTICS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rbacData.map((row, index) => (
                      <tr key={index}>
                        <td>{row.role}</td>
                        <td>{row.fleet}</td>
                        <td>{row.drivers}</td>
                        <td>{row.trips}</td>
                        <td>{row.fuel}</td>
                        <td>{row.analytics}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Preferences (Moved to bottom) */}
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
