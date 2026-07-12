import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { 
  Truck, Users, Map, Wrench, Fuel, BarChart3, 
  Shield, ArrowRight, Lock, Play, CheckCircle2, 
  AlertCircle, ChevronRight, DollarSign, Activity, 
  Sparkles, RefreshCw, Layers
} from 'lucide-react';
import useAuth from '../hooks/useAuth';

const Home = () => {
  const { isAuthenticated, role, login } = useAuth();
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('Fleet Manager');
  const [simStep, setSimStep] = useState(1);
  const [loginLoading, setLoginLoading] = useState(null);
  const [loginError, setLoginError] = useState('');
  
  // Simulator State
  const [cargoWeight, setCargoWeight] = useState(450);
  const [odometer, setOdometer] = useState(1000);
  const [fuelConsumed, setFuelConsumed] = useState(15);
  const [simVehicleStatus, setSimVehicleStatus] = useState('Available');
  const [simDriverStatus, setSimDriverStatus] = useState('Available');
  const [simTripStatus, setSimTripStatus] = useState('Draft');
  const [maintenanceLogged, setMaintenanceLogged] = useState(false);

  // Accounts for quick login
  const testAccounts = [
    {
      name: 'Ravi Kumar',
      email: 'fleet@transitops.com',
      password: 'Fleet@123',
      role: 'Fleet Manager',
      badge: 'Full Access',
      color: '#3b82f6', // Blue
      desc: 'Oversees fleet assets, maintenance logging, user settings, and core operations.'
    },
    {
      name: 'Alex Johnson',
      email: 'dispatch@transitops.com',
      password: 'Dispatch@123',
      role: 'Dispatcher',
      badge: 'Operations',
      color: '#10b981', // Emerald
      desc: 'Creates trips, assigns vehicles & drivers, validates capacities, and schedules runs.'
    },
    {
      name: 'Priya Sharma',
      email: 'safety@transitops.com',
      password: 'Safety@123',
      role: 'Safety Officer',
      badge: 'Compliance',
      color: '#8b5cf6', // Purple
      desc: 'Ensures driver compliance, license validity checks, safety scores, and suspensions.'
    },
    {
      name: 'John Davis',
      email: 'finance@transitops.com',
      password: 'Finance@123',
      role: 'Financial Analyst',
      badge: 'Finance & ROI',
      color: '#f59e0b', // Amber
      desc: 'Tracks fuel logs, toll costs, maintenance expenses, and calculates vehicle ROI.'
    }
  ];

  // Quick Login Action
  const handleQuickLogin = async (account) => {
    setLoginError('');
    setLoginLoading(account.role);
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', {
        email: account.email,
        password: account.password
      });

      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      setLoginError(err.response?.data?.message || 'Connection failed. Is the server running?');
    } finally {
      setLoginLoading(null);
    }
  };

  // Reset Simulator
  const resetSimulator = () => {
    setSimStep(1);
    setSimVehicleStatus('Available');
    setSimDriverStatus('Available');
    setSimTripStatus('Draft');
    setMaintenanceLogged(false);
    setCargoWeight(450);
    setOdometer(1000);
    setFuelConsumed(15);
  };

  // Handle simulator steps transitions
  useEffect(() => {
    if (simStep === 1) {
      setSimVehicleStatus('Available');
    } else if (simStep === 2) {
      setSimDriverStatus('Available');
    } else if (simStep === 5) {
      setSimVehicleStatus('On Trip');
      setSimDriverStatus('On Trip');
      setSimTripStatus('Dispatched');
    } else if (simStep === 7) {
      setSimVehicleStatus('Available');
      setSimDriverStatus('Available');
      setSimTripStatus('Completed');
    } else if (simStep === 8) {
      setSimVehicleStatus('In Shop');
      setMaintenanceLogged(true);
    }
  }, [simStep]);

  return (
    <div className="home-page">
      {/* Header */}
      <header className="home-header">
        <div className="home-nav-container">
          <div className="home-logo">
            <img src="/favicon.svg" alt="TransitOps Logo" style={{ width: '24px', height: '24px' }} />
            <span>TransitOps</span>
          </div>
          <nav className="home-nav">
            <a href="#features">Features</a>
            <a href="#roles">Roles</a>
            <a href="#workflow">Workflow Demo</a>
            <a href="#quick-login">Quick Start</a>
          </nav>
          <div className="home-nav-actions">
            {isAuthenticated ? (
              <div className="auth-nav-group">
                <span className="user-indicator">
                  Signed in as <strong>{role}</strong>
                </span>
                <Link to="/dashboard" className="btn-nav-primary">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </Link>
              </div>
            ) : (
              <Link to="/login" className="btn-nav-primary">
                Sign In
                <ArrowRight size={16} />
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="home-hero">
        <div className="hero-content">
          <div className="hero-badge">
            <Sparkles size={14} className="badge-sparkle" />
            <span>Smart Transport Operations Platform</span>
          </div>
          <h1>
            Automate & Optimize <br />
            <span className="gradient-text">Your Fleet Lifecycle</span>
          </h1>
          <p className="hero-subtitle">
            Transition from spreadsheets and manual logs to a centralized logistics platform. 
            Track vehicles, drivers, dispatches, maintenance compliance, and operational ROI in real-time.
          </p>

          <div className="hero-ctas">
            <Link to="/login" className="btn-hero-primary">
              Launch Platform
              <ArrowRight size={18} />
            </Link>
            <a href="#quick-login" className="btn-hero-secondary">
              Try Quick Logins
            </a>
          </div>

          </div>

        {/* Floating Mockup Display */}
        <div className="hero-mockup-container">
          <div className="hero-mockup">
            <div className="mockup-header">
              <span className="dot dot-red"></span>
              <span className="dot dot-yellow"></span>
              <span className="dot dot-green"></span>
              <span className="mockup-title">transitops-ops-dashboard</span>
            </div>
            <div className="mockup-body">
              <div className="mockup-stats-grid">
                <div className="mockup-stat-card">
                  <span className="stat-label">Active Fleet</span>
                  <span className="stat-val">12</span>
                  <span className="stat-change text-green">+2 today</span>
                </div>
                <div className="mockup-stat-card">
                  <span className="stat-label">Active Trips</span>
                  <span className="stat-val">5</span>
                  <span className="stat-indicator pulse-blue">On Route</span>
                </div>
                <div className="mockup-stat-card">
                  <span className="stat-label">Utilization</span>
                  <span className="stat-val">87.5%</span>
                  <span className="stat-bar"><span className="stat-bar-fill" style={{ width: '87.5%' }}></span></span>
                </div>
              </div>
              <div className="mockup-list-container">
                <div className="mockup-list-header">Active Operations</div>
                <div className="mockup-list-item">
                  <Truck size={14} className="text-blue" />
                  <span>Van-05 (Heavy Cargo)</span>
                  <span className="badge-trip status-ontrip">On Trip</span>
                </div>
                <div className="mockup-list-item">
                  <Truck size={14} className="text-yellow" />
                  <span>Truck-02 (Maintenance)</span>
                  <span className="badge-trip status-maintenance">In Shop</span>
                </div>
                <div className="mockup-list-item">
                  <Users size={14} className="text-green" />
                  <span>Alex Johnson (Driver)</span>
                  <span className="badge-trip status-available">Available</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Login Accounts Grid */}
      <section id="quick-login" className="home-section quick-login-section">
        <div className="section-header">
          <h2>Jump Right In</h2>
          <p>We've pre-seeded the application database with 4 key operational roles. Click a profile below to log in instantly and test their workflow.</p>
        </div>

        {loginError && (
          <div className="error-message home-login-error">
            <AlertCircle size={18} />
            <span>{loginError}</span>
            <button className="error-retry-btn" onClick={() => setLoginError('')}>Dismiss</button>
          </div>
        )}

        <div className="accounts-grid">
          {testAccounts.map((account) => (
            <div 
              key={account.role} 
              className="account-card"
              style={{ '--accent-color': account.color }}
              onClick={() => handleQuickLogin(account)}
            >
              <div className="account-card-header">
                <span className="account-role-badge" style={{ backgroundColor: `${account.color}15`, color: account.color, borderColor: `${account.color}30` }}>
                  {account.badge}
                </span>
                <span className="account-login-status">
                  {loginLoading === account.role ? (
                    <RefreshCw size={16} className="spinner-icon animate-spin" />
                  ) : (
                    <Lock size={14} />
                  )}
                </span>
              </div>
              <h3>{account.role}</h3>
              <p className="account-name">{account.name}</p>
              <p className="account-email">{account.email}</p>
              <p className="account-desc">{account.desc}</p>
              <button 
                className="btn-account-login" 
                style={{ backgroundColor: account.color }}
                disabled={loginLoading !== null}
              >
                {loginLoading === account.role ? 'Authenticating...' : 'Enter App'}
                <ArrowRight size={14} />
              </button>
            </div>
          ))}
        </div>
        <p className="credentials-info-text">
          * Standard credentials: Password is <strong>[Role]@123</strong> (e.g. <code>Fleet@123</code> for Fleet Manager).
        </p>
      </section>

      {/* Target Roles Details */}
      <section id="roles" className="home-section roles-section">
        <div className="section-header">
          <h2>Designed for Seamless Collaboration</h2>
          <p>TransitOps bridges the gap between drivers, safety auditors, and management through Role-Based Access Control (RBAC).</p>
        </div>

        <div className="roles-container">
          <div className="roles-tabs">
            {testAccounts.map((account) => (
              <button
                key={account.role}
                className={`role-tab-btn ${activeTab === account.role ? 'active' : ''}`}
                onClick={() => setActiveTab(account.role)}
              >
                {account.role}
              </button>
            ))}
          </div>

          <div className="roles-tab-content">
            {testAccounts.map((account) => {
              if (account.role !== activeTab) return null;
              return (
                <div key={account.role} className="role-details-panel">
                  <div className="role-details-info">
                    <span className="role-label" style={{ color: account.color }}>{account.role} Perspective</span>
                    <h3>Managing operations with granular authority</h3>
                    <p>{account.desc}</p>
                    
                    <ul className="role-features-list">
                      {account.role === 'Fleet Manager' && (
                        <>
                          <li><CheckCircle2 size={16} className="text-green" /> Register, monitor, and retire vehicles</li>
                          <li><CheckCircle2 size={16} className="text-green" /> View system-wide compliance logs</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Register new system users and assign roles</li>
                        </>
                      )}
                      {account.role === 'Dispatcher' && (
                        <>
                          <li><CheckCircle2 size={16} className="text-green" /> Assign available drivers to available vehicles</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Enforce load capacity validations in real-time</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Dispatch and track lifecycle of customer shipments</li>
                        </>
                      )}
                      {account.role === 'Safety Officer' && (
                        <>
                          <li><CheckCircle2 size={16} className="text-green" /> Monitor driver safety scores</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Maintain license expiry dates & suspend drivers</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Prevent dispatched trips with invalid drivers</li>
                        </>
                      )}
                      {account.role === 'Financial Analyst' && (
                        <>
                          <li><CheckCircle2 size={16} className="text-green" /> Record precise fuel consumption logs</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Log toll bills, maintenance charges, and miscellaneous fees</li>
                          <li><CheckCircle2 size={16} className="text-green" /> Calculate distance/fuel efficiency and vehicle ROI indices</li>
                        </>
                      )}
                    </ul>
                  </div>
                  <div className="role-details-visual">
                    <div className="visual-dashboard-stub">
                      <div className="stub-header" style={{ borderLeftColor: account.color }}>
                        <span>Role Module Workspace: {account.role}</span>
                      </div>
                      <div className="stub-modules">
                        {account.role === 'Fleet Manager' && (
                          <div className="stub-module-box">
                            <span className="box-title">Core Fleet Control</span>
                            <div className="box-item"><span>Vehicle Registry (CRUD)</span> <span className="text-green">Available</span></div>
                            <div className="box-item"><span>Maintenance Log Status</span> <span className="text-yellow">Alerts</span></div>
                            <div className="box-item"><span>User Administration</span> <span className="text-blue">RBAC</span></div>
                          </div>
                        )}
                        {account.role === 'Dispatcher' && (
                          <div className="stub-module-box">
                            <span className="box-title">Dispatch Operations</span>
                            <div className="box-item"><span>Active Route Planner</span> <span className="text-blue">Dispatched</span></div>
                            <div className="box-item"><span>Capacity Verification Gate</span> <span className="text-green">Active</span></div>
                            <div className="box-item"><span>Trip Lifecycle Management</span> <span className="text-blue">Sync</span></div>
                          </div>
                        )}
                        {account.role === 'Safety Officer' && (
                          <div className="stub-module-box">
                            <span className="box-title">Compliance Registry</span>
                            <div className="box-item"><span>License Expiry Trackers</span> <span className="text-red">2 Expiring</span></div>
                            <div className="box-item"><span>Safety Score Ledger</span> <span className="text-green">AVG 87%</span></div>
                            <div className="box-item"><span>Driver Status Audit Panel</span> <span className="text-blue">Available</span></div>
                          </div>
                        )}
                        {account.role === 'Financial Analyst' && (
                          <div className="stub-module-box">
                            <span className="box-title">Financial Ledger</span>
                            <div className="box-item"><span>Fuel Economy Logs</span> <span className="text-green">Km/L</span></div>
                            <div className="box-item"><span>Maintenance & Expense Ledgers</span> <span className="text-red">Cost Accum.</span></div>
                            <div className="box-item"><span>Return on Investment Metrics</span> <span className="text-blue">ROI %</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Interactive Workflow Simulator */}
      <section id="workflow" className="home-section simulator-section">
        <div className="section-header">
          <h2>Interactive Workflow Simulator</h2>
          <p>Observe the platform's logical transition cycle step-by-step. Play through the scenario to see how business constraints enforce operations.</p>
        </div>

        <div className="simulator-container">
          {/* Step Timeline */}
          <div className="sim-timeline">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((stepNum) => (
              <div 
                key={stepNum} 
                className={`sim-timeline-node ${simStep === stepNum ? 'active' : ''} ${simStep > stepNum ? 'completed' : ''}`}
                onClick={() => setSimStep(stepNum)}
              >
                <div className="node-num">{stepNum}</div>
                <span className="node-label">Step {stepNum}</span>
              </div>
            ))}
          </div>

          {/* Simulator Panel Workspace */}
          <div className="sim-workspace">
            <div className="sim-control-panel">
              <div className="sim-step-title-row">
                <span className="sim-step-badge">Scenario Step {simStep}</span>
                <button className="sim-reset-btn" onClick={resetSimulator}>
                  <RefreshCw size={14} />
                  Reset Demo
                </button>
              </div>

              {simStep === 1 && (
                <div className="sim-step-info">
                  <h3>Register Vehicle 'Van-05'</h3>
                  <p>A logistics company registers a new delivery vehicle. We assign a max capacity rating to enforce future trip loading boundaries.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(2)}>
                      Register Van-05 & Proceed <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 2 && (
                <div className="sim-step-info">
                  <h3>Register Driver 'Alex'</h3>
                  <p>Create a driver profile with a valid driving license, license class category, and active status.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(3)}>
                      Register Driver & Proceed <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 3 && (
                <div className="sim-step-info">
                  <h3>Configure Trip Weights</h3>
                  <p>Prepare a shipment trip. Dispatchers define the source, destination, cargo weight, and route distance.</p>
                  <div className="sim-input-group">
                    <label className="sim-label">Cargo Weight (kg): <strong>{cargoWeight} kg</strong></label>
                    <input 
                      type="range" 
                      min="100" 
                      max="700" 
                      value={cargoWeight} 
                      className="sim-slider"
                      onChange={(e) => setCargoWeight(Number(e.target.value))}
                    />
                    <span className="slider-help">Van-05 Capacity: 500kg. Exceeding 500kg will fail validation check.</span>
                  </div>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(4)}>
                      Validate Constraints <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 4 && (
                <div className="sim-step-info">
                  <h3>Capacity Check Verification</h3>
                  <p>The system evaluates safety limits. Cargo Weight must not exceed the vehicle's maximum load capacity rating.</p>
                  
                  {cargoWeight <= 500 ? (
                    <div className="validation-result success">
                      <CheckCircle2 className="text-green" size={20} />
                      <div>
                        <strong>Validation Passed!</strong>
                        <p>{cargoWeight} kg ≤ 500 kg capacity limit. Safe to dispatch.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="validation-result error animate-shake">
                      <AlertCircle className="text-red" size={20} />
                      <div>
                        <strong>Overweight Warning!</strong>
                        <p>{cargoWeight} kg exceeds 500 kg limit. Safety rules block dispatch.</p>
                      </div>
                    </div>
                  )}

                  <div className="sim-action-box">
                    {cargoWeight <= 500 ? (
                      <button className="btn-sim-action" onClick={() => setSimStep(5)}>
                        Dispatch Trip <ChevronRight size={16} />
                      </button>
                    ) : (
                      <button className="btn-sim-action btn-disabled" disabled>
                        Cannot Dispatch (Overweight)
                      </button>
                    )}
                  </div>
                </div>
              )}

              {simStep === 5 && (
                <div className="sim-step-info">
                  <h3>Active Dispatch Status</h3>
                  <p>Dispatching a trip automatically transitions the assigned vehicle and driver status to <strong>"On Trip"</strong>, locks them from other rosters, and updates the Trip state.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(6)}>
                      Begin Trip Completion <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 6 && (
                <div className="sim-step-info">
                  <h3>Complete Trip Log</h3>
                  <p>Upon arrival, record the final odometer reading (planned distance 150 km) and the total fuel consumed to calculate operational metrics.</p>
                  <div className="sim-grid-inputs">
                    <div className="sim-input-group">
                      <label className="sim-label">New Odometer (km)</label>
                      <input 
                        type="number" 
                        value={odometer + 150} 
                        readOnly 
                        className="sim-input-disabled"
                      />
                    </div>
                    <div className="sim-input-group">
                      <label className="sim-label">Fuel Consumed (L)</label>
                      <input 
                        type="number" 
                        value={fuelConsumed} 
                        onChange={(e) => setFuelConsumed(Number(e.target.value))}
                        className="sim-text-input"
                      />
                    </div>
                  </div>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(7)}>
                      Complete & Mark Available <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 7 && (
                <div className="sim-step-info">
                  <h3>Roster Restoration</h3>
                  <p>Completing the trip successfully releases the driver and vehicle. Their statuses automatically transition back to <strong>"Available"</strong>.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(8)}>
                      Send Vehicle to Maintenance <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 8 && (
                <div className="sim-step-info">
                  <h3>Vehicle Maintenance (Oil Change)</h3>
                  <p>Creating an active maintenance log switches the vehicle status to <strong>"In Shop"</strong>, automatically removing it from the Dispatcher's active selection list.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action" onClick={() => setSimStep(9)}>
                      Examine Reports <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              )}

              {simStep === 9 && (
                <div className="sim-step-info">
                  <h3>Reports & Fuel Efficiency Dashboard</h3>
                  <p>Calculates cumulative metrics. Fuel Efficiency: <code>{(150 / fuelConsumed).toFixed(2)} km/L</code>. Total Expense = Fuel cost ($3.50/L) + maintenance. ROI is dynamically adjusted.</p>
                  <div className="sim-action-box">
                    <button className="btn-sim-action btn-secondary-sim" onClick={resetSimulator}>
                      Restart Demo Walkthrough <RefreshCw size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Simulated Live Database Preview */}
            <div className="sim-db-preview">
              <h4>Roster State Ledger</h4>
              <div className="db-cards-container">
                {/* Vehicle Card */}
                <div className={`db-card ${simStep >= 1 ? 'visible' : 'hidden'}`}>
                  <div className="db-card-hdr">
                    <span className="db-card-title">Vehicle State</span>
                    <Truck size={14} />
                  </div>
                  <div className="db-row"><span>ID:</span> <strong>Van-05</strong></div>
                  <div className="db-row"><span>Load Capacity:</span> <strong>500 kg</strong></div>
                  <div className="db-row">
                    <span>Status:</span> 
                    <span className={`badge-sim status-${simVehicleStatus.replace(' ', '').toLowerCase()}`}>
                      {simVehicleStatus}
                    </span>
                  </div>
                </div>

                {/* Driver Card */}
                <div className={`db-card ${simStep >= 2 ? 'visible' : 'hidden'}`}>
                  <div className="db-card-hdr">
                    <span className="db-card-title">Driver State</span>
                    <Users size={14} />
                  </div>
                  <div className="db-row"><span>Name:</span> <strong>Alex</strong></div>
                  <div className="db-row"><span>License:</span> <strong className="text-green">Valid</strong></div>
                  <div className="db-row">
                    <span>Status:</span> 
                    <span className={`badge-sim status-${simDriverStatus.replace(' ', '').toLowerCase()}`}>
                      {simDriverStatus}
                    </span>
                  </div>
                </div>

                {/* Trip Card */}
                <div className={`db-card ${simStep >= 3 ? 'visible' : 'hidden'}`}>
                  <div className="db-card-hdr">
                    <span className="db-card-title">Active Dispatch</span>
                    <Map size={14} />
                  </div>
                  <div className="db-row"><span>Route:</span> <strong>Warehouse A ➔ B</strong></div>
                  <div className="db-row"><span>Cargo Weight:</span> <strong>{cargoWeight} kg</strong></div>
                  <div className="db-row">
                    <span>Trip State:</span> 
                    <span className={`badge-sim status-${simTripStatus.toLowerCase()}`}>
                      {simTripStatus}
                    </span>
                  </div>
                </div>

                {/* Maintenance Log Card */}
                <div className={`db-card ${maintenanceLogged ? 'visible' : 'hidden'}`}>
                  <div className="db-card-hdr">
                    <span className="db-card-title">Maintenance Log</span>
                    <Wrench size={14} />
                  </div>
                  <div className="db-row"><span>Activity:</span> <strong>Oil Change</strong></div>
                  <div className="db-row"><span>Cost:</span> <strong>$120.00</strong></div>
                  <div className="db-row"><span>Lockout Status:</span> <strong className="text-red">IN SHOP</strong></div>
                </div>
              </div>

              {/* Reports Dashboard Section */}
              <div className={`sim-reports-panel ${simStep === 9 ? 'visible' : 'hidden'}`}>
                <h5>Updated Vehicle Metrics (Van-05)</h5>
                <div className="metrics-pill-grid">
                  <div className="metric-pill">
                    <span className="pill-lbl">Fuel efficiency</span>
                    <strong className="text-green">{(150 / fuelConsumed).toFixed(1)} km/L</strong>
                  </div>
                  <div className="metric-pill">
                    <span className="pill-lbl">Maintenance Cost</span>
                    <strong>$120.00</strong>
                  </div>
                  <div className="metric-pill">
                    <span className="pill-lbl">Fuel Expense</span>
                    <strong>${(fuelConsumed * 3.5).toFixed(2)}</strong>
                  </div>
                  <div className="metric-pill">
                    <span className="pill-lbl">Estimated ROI</span>
                    <strong className="text-blue">14.6%</strong>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Compliance Constraints Overview */}
      <section id="features" className="home-section compliance-section">
        <div className="section-header">
          <h2>Mandatory Business Compliance</h2>
          <p>TransitOps' logical validation core systematically enforces regulatory and company policy standards.</p>
        </div>

        <div className="compliance-grid">
          <div className="compliance-card">
            <div className="comp-icon-box bg-blue-tint">
              <Shield size={24} className="text-blue" />
            </div>
            <h3>Roster Lockout Logic</h3>
            <p>Drivers or vehicles already marked "On Trip" are programmatically blocked from being scheduled on overlapping dispatches, eliminating scheduling conflicts.</p>
          </div>

          <div className="compliance-card">
            <div className="comp-icon-box bg-purple-tint">
              <Lock size={24} className="text-purple" />
            </div>
            <h3>Driver Safety Gates</h3>
            <p>Safety scores and driver licenses are actively audited. Drivers with expired credentials or a suspended status are immediately locked out from the dispatcher pools.</p>
          </div>

          <div className="compliance-card">
            <div className="comp-icon-box bg-green-tint">
              <Wrench size={24} className="text-green" />
            </div>
            <h3>Automatic Maintenance Locks</h3>
            <p>Submitting a vehicle to the maintenance queue automatically updates its status to "In Shop," instantly preventing it from being dispatched until repairs are closed.</p>
          </div>

          <div className="compliance-card">
            <div className="comp-icon-box bg-yellow-tint">
              <Activity size={24} className="text-yellow" />
            </div>
            <h3>Odometer & Fuel Logs</h3>
            <p>Mandatory odometer and fuel entry upon trip arrival ensures fuel efficiency curves are calculated reliably and financial cost registers stay synchronized.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="home-footer-section">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="home-logo">
              <img src="/favicon.svg" alt="TransitOps Logo" style={{ width: '24px', height: '24px' }} />
              <span>TransitOps</span>
            </div>
            <p>Digitizing corporate logistics and vehicle compliance.</p>
          </div>
          <div className="footer-meta">
            <span>Created for Transit Operations Excellence</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
