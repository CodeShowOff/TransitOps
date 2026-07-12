import React, { useState } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';

const UserManagement = () => {
  const { role, token } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', employeeId: '',
    department: '', role: 'Dispatcher', password: '', confirmPassword: '', status: 'Active'
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  // RBAC check: only Fleet Manager
  if (role !== 'Fleet Manager') {
    return <Navigate to="/dashboard" replace />;
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      setLoading(true);
      const res = await axios.post('http://localhost:5000/api/auth/register', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.success) {
        setSuccess('User Created Successfully');
        // Reset form
        setFormData({
          name: '', email: '', phone: '', employeeId: '',
          department: '', role: 'Dispatcher', password: '', confirmPassword: '', status: 'Active'
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>User Management</h1>
      </div>

      <div className="card">
        {error && (
          <div className="error-message mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        {success && (
          <div className="success-message mb-4">
            <CheckCircle size={18} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <h3 className="form-section-title">Personal Information</h3>
            
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" name="name" className="form-input" required value={formData.name} onChange={handleChange} />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Employee ID</label>
              <input type="text" name="employeeId" className="form-input" required value={formData.employeeId} onChange={handleChange} />
            </div>

            <h3 className="form-section-title">Professional Information</h3>

            <div className="form-group">
              <label className="form-label">Department</label>
              <input type="text" name="department" className="form-input" required value={formData.department} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Role</label>
              <select name="role" className="form-input" value={formData.role} onChange={handleChange}>
                <option value="Fleet Manager">Fleet Manager</option>
                <option value="Dispatcher">Dispatcher</option>
                <option value="Safety Officer">Safety Officer</option>
                <option value="Financial Analyst">Financial Analyst</option>
              </select>
            </div>

            <h3 className="form-section-title">Security & Status</h3>

            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" required value={formData.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input type="password" name="confirmPassword" className="form-input" required value={formData.confirmPassword} onChange={handleChange} />
            </div>

            <div className="form-group full-width">
              <label className="form-label">Status</label>
              <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={() => setFormData({...formData})}>Cancel</button>
            <button type="submit" className="btn-primary" style={{width: 'auto'}} disabled={loading}>
              {loading ? 'Creating...' : '+ Add User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserManagement;
