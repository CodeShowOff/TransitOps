import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { AlertCircle, CheckCircle, Edit, Power, PowerOff, X } from 'lucide-react';
import useAuth from '../../hooks/useAuth';
import { Navigate } from 'react-router-dom';
import './UserManagement.css';

const UserManagement = () => {
  const { role, token, user: currentUser } = useAuth();
  
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [filters, setFilters] = useState({
    search: '',
    role: '',
    status: ''
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  
  const initialFormState = {
    name: '', email: '', phone: '', employeeId: '',
    department: '', role: 'Dispatcher', password: '', confirmPassword: '', status: 'Active'
  };
  
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState(null);

  // RBAC check: only Fleet Manager
  if (role !== 'Fleet Manager') {
    return <Navigate to="/dashboard" replace />;
  }

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        setUsers(res.data.data);
      }
    } catch (err) {
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ search: '', role: '', status: '' });
  };

  const filteredUsers = users.filter(user => {
    const matchSearch = user.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                        user.email.toLowerCase().includes(filters.search.toLowerCase());
    const matchRole = filters.role ? user.role === filters.role : true;
    const matchStatus = filters.status ? user.status === filters.status : true;
    return matchSearch && matchRole && matchStatus;
  });

  const openCreateModal = () => {
    setModalMode('create');
    setFormData(initialFormState);
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (user) => {
    setModalMode('edit');
    setEditingId(user._id);
    setFormData({
      ...user,
      password: '',
      confirmPassword: ''
    });
    setError('');
    setSuccess('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (modalMode === 'create') {
      if (formData.password.length < 8) {
        return setError('Password must be at least 8 characters');
      }
      if (formData.password !== formData.confirmPassword) {
        return setError('Passwords do not match');
      }
    }

    try {
      setLoading(true);
      if (modalMode === 'create') {
        const res = await axios.post('http://localhost:5000/api/users', formData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setSuccess('User created successfully');
          fetchUsers();
          setTimeout(() => setIsModalOpen(false), 1500);
        }
      } else {
        const updateData = {
          name: formData.name,
          phone: formData.phone,
          department: formData.department,
          role: formData.role,
          status: formData.status
        };
        const res = await axios.put(`http://localhost:5000/api/users/${editingId}`, updateData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.data.success) {
          setSuccess('User updated successfully');
          fetchUsers();
          setTimeout(() => setIsModalOpen(false), 1500);
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${modalMode} user`);
    } finally {
      setLoading(false);
    }
  };

  const toggleUserStatus = async (userId, currentStatus) => {
    if (userId === currentUser.id) {
      setError('You cannot deactivate your own account.');
      return;
    }

    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      const res = await axios.patch(`http://localhost:5000/api/users/${userId}/status`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.success) {
        fetchUsers();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update user status');
    }
  };

  return (
    <div className="page-container">
      <div className="header-actions">
        <h1>User Management</h1>
        <button className="btn-primary" style={{ width: 'auto' }} onClick={openCreateModal}>+ Add User</button>
      </div>

      <div className="filters-container">
        <div className="filters-bar">
          <input
            type="text"
            name="search"
            placeholder="Search by name or email"
            value={filters.search}
            onChange={handleFilterChange}
            className="form-input filter-input"
          />
          <select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
            className="form-input filter-input"
          >
            <option value="">All Roles</option>
            <option value="Fleet Manager">Fleet Manager</option>
            <option value="Dispatcher">Dispatcher</option>
            <option value="Safety Officer">Safety Officer</option>
            <option value="Financial Analyst">Financial Analyst</option>
          </select>
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="form-input filter-input"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
          {(filters.search || filters.role || filters.status) && (
            <button onClick={handleClearFilters} className="btn-outline">
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      <div className="card">
        {error && !isModalOpen && (
          <div className="error-message mb-4">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <div className="users-table-container">
          <table className="users-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Last Login</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map(user => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td>
                    <span className={`status-badge ${user.status.toLowerCase()}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                  <td>
                    <div className="actions-cell">
                      <button className="btn-icon" onClick={() => openEditModal(user)} title="Edit">
                        <Edit size={18} />
                      </button>
                      <button 
                        className={`btn-icon ${user.status === 'Active' ? 'danger' : ''}`}
                        onClick={() => toggleUserStatus(user._id, user.status)}
                        disabled={user._id === currentUser.id}
                        title={user.status === 'Active' ? 'Deactivate' : 'Activate'}
                        style={{ opacity: user._id === currentUser.id ? 0.3 : 1, cursor: user._id === currentUser.id ? 'not-allowed' : 'pointer' }}
                      >
                        {user.status === 'Active' ? <PowerOff size={18} /> : <Power size={18} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredUsers.length === 0 && !loading && (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No users found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{modalMode === 'create' ? 'Create New User' : 'Edit User'}</h2>
              <button className="close-btn" onClick={() => setIsModalOpen(false)}>
                <X size={24} />
              </button>
            </div>
            
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
                  <input type="email" name="email" className="form-input" required value={formData.email} onChange={handleChange} disabled={modalMode === 'edit'} />
                </div>

                <div className="form-group">
                  <label className="form-label">Phone Number</label>
                  <input type="tel" name="phone" className="form-input" required value={formData.phone} onChange={handleChange} />
                </div>

                <div className="form-group">
                  <label className="form-label">Employee ID</label>
                  <input type="text" name="employeeId" className="form-input" required value={formData.employeeId} onChange={handleChange} disabled={modalMode === 'edit'} />
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

                {modalMode === 'create' && (
                  <>
                    <h3 className="form-section-title">Security & Status</h3>

                    <div className="form-group">
                      <label className="form-label">Password</label>
                      <input type="password" name="password" className="form-input" required={modalMode === 'create'} value={formData.password} onChange={handleChange} />
                    </div>

                    <div className="form-group">
                      <label className="form-label">Confirm Password</label>
                      <input type="password" name="confirmPassword" className="form-input" required={modalMode === 'create'} value={formData.confirmPassword} onChange={handleChange} />
                    </div>
                  </>
                )}

                {modalMode === 'edit' && (
                  <h3 className="form-section-title">Status</h3>
                )}

                <div className="form-group full-width">
                  <label className="form-label">Status</label>
                  <select name="status" className="form-input" value={formData.status} onChange={handleChange}>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="action-buttons" style={{ marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
                <button type="submit" className="btn-primary" style={{width: 'auto'}} disabled={loading}>
                  {loading ? 'Saving...' : (modalMode === 'create' ? '+ Add User' : 'Save Changes')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
