import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { API_BASE_URL } from '../../config';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email) return setError('Email is required');
    if (!password) return setError('Password is required');
    if (password.length < 8) return setError('Password minimum 8 characters');

    try {
      setLoading(true);
      const res = await axios.post(`${API_BASE_URL}/auth/login`, {
        email,
        password
      });

      if (res.data.success) {
        login(res.data.user, res.data.token);
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', padding: '2rem' }}>
      <div className="login-card">
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b', textDecoration: 'none', marginBottom: '1.5rem', fontSize: '0.875rem', fontWeight: '500' }}>
          <ArrowLeft size={16} />
          Back to Home
        </Link>
        <div className="login-header">
          <h1>TransitOps</h1>
          <p>Sign in to your account</p>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="name@transitops.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" onChange={() => alert('Remember Me feature is upcoming!')} />
              Remember Me
            </label>
            <a href="#" className="forgot-link" onClick={(e) => { e.preventDefault(); alert('Forgot Password feature is upcoming!'); }}>Forgot Password?</a>
          </div>

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </div>

      <div className="login-card" style={{ margin: '0', animationDelay: '0.1s', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1rem', color: '#f8fafc' }}>Testing Credentials</h3>
        <p style={{ color: '#94a3b8', marginBottom: '2rem', lineHeight: '1.5', fontSize: '0.9rem' }}>
          <strong>Note:</strong> Users are created by admins (the Fleet Manager) only. Employees can log in using the ID and passwords provided by the manager.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', color: '#f1f5f9', fontSize: '0.9rem', flexGrow: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8' }}>Fleet Manager:</span> <strong style={{textAlign: 'right'}}>fleet@transitops.com <br/> Fleet@123</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8' }}>Dispatcher:</span> <strong style={{textAlign: 'right'}}>dispatch@transitops.com <br/> Dispatch@123</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '0.75rem' }}>
            <span style={{ color: '#94a3b8' }}>Safety Officer:</span> <strong style={{textAlign: 'right'}}>safety@transitops.com <br/> Safety@123</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94a3b8' }}>Financial Analyst:</span> <strong style={{textAlign: 'right'}}>finance@transitops.com <br/> Finance@123</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
