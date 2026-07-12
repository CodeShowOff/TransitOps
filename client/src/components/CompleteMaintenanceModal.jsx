import React, { useState } from 'react';
import { completeMaintenance } from '../services/maintenanceApi';
import { AlertCircle, X } from 'lucide-react';

const CompleteMaintenanceModal = ({ maintenanceId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    completedDate: new Date().toISOString().split('T')[0], // Default to today
    actualCost: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await completeMaintenance(maintenanceId, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete maintenance record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.75)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '1rem'
    }}>
      <div className="login-card" style={{ width: '100%', maxWidth: '500px', margin: 0, padding: '2.5rem', animationDelay: '0s' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-primary)', margin: 0 }}>
            Complete Maintenance
          </h2>
          <button 
            onClick={onClose} 
            style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.25rem' }}
          >
            <X size={24} />
          </button>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}
        
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '0.95rem' }}>
          Completing this maintenance will change the vehicle status back to "Available".
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Completed Date *</label>
            <input
              type="date"
              name="completedDate"
              value={formData.completedDate}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Actual Cost (₹) *</label>
            <input
              type="number"
              name="actualCost"
              value={formData.actualCost}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="0.00"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Remarks</label>
            <textarea
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              rows="3"
              placeholder="Any final notes..."
              className="form-input"
              style={{ resize: 'vertical' }}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2.5rem' }}>
            <button 
              type="button" 
              onClick={onClose} 
              disabled={loading}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: 'transparent', 
                border: '1px solid var(--border-color, #475569)', 
                color: 'var(--text-primary, #f8fafc)', 
                borderRadius: '8px', 
                cursor: 'pointer',
                fontWeight: 500
              }}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="btn-primary"
              style={{ width: 'auto', padding: '0.75rem 1.5rem' }}
            >
              {loading ? 'Completing...' : 'Complete Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteMaintenanceModal;
