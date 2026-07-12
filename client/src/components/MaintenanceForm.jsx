import React, { useState, useEffect } from 'react';
import { getVehicles } from '../services/vehicleApi';
import { createMaintenance } from '../services/maintenanceApi';
import { X } from 'lucide-react';

const SERVICE_TYPES = [
  'Oil Change',
  'Engine Repair',
  'Brake Service',
  'Tyre Replacement',
  'Battery Change',
  'General Service',
  'Accident Repair',
  'Other'
];

const MaintenanceForm = ({ isOpen, onClose, onSuccess }) => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    vehicle: '',
    serviceType: '',
    description: '',
    workshop: '',
    scheduledDate: '',
    estimatedCost: ''
  });

  const [selectedVehicleDetails, setSelectedVehicleDetails] = useState(null);

  useEffect(() => {
    fetchVehicles();
  }, []);

  useEffect(() => {
    if (formData.vehicle) {
      const selected = vehicles.find(v => v._id === formData.vehicle);
      setSelectedVehicleDetails(selected);
    } else {
      setSelectedVehicleDetails(null);
    }
  }, [formData.vehicle, vehicles]);

  const fetchVehicles = async () => {
    try {
      const res = await getVehicles({ limit: 100 });
      if (res && res.data) {
        const availableVehicles = res.data.filter(v => v.status !== 'In Shop' && v.status !== 'Retired');
        setVehicles(availableVehicles);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
      setError('Failed to load vehicles');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await createMaintenance(formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create maintenance record');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>Create Maintenance Record</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} id="maintenance-form">
          <div className="modal-body">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            <div style={{ background: 'rgba(59, 130, 246, 0.05)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
              <h4 style={{ color: 'var(--brand-primary)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Vehicle Information</h4>
              <div style={{ marginBottom: '1rem' }}>
                <label className="form-label">Vehicle *</label>
                <select
                  name="vehicle"
                  value={formData.vehicle}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select a vehicle</option>
                  {vehicles.map(v => (
                    <option key={v._id} value={v._id}>
                      {v.registrationNumber} - {v.model}
                    </option>
                  ))}
                </select>
              </div>
              
              {selectedVehicleDetails && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.875rem' }}>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Current Odometer</span>
                    <span style={{ fontWeight: 500 }}>{selectedVehicleDetails.odometer} km</span>
                  </div>
                  <div>
                    <span style={{ color: 'var(--text-secondary)', display: 'block', fontSize: '0.75rem' }}>Current Status</span>
                    <span style={{ fontWeight: 500 }}>{selectedVehicleDetails.status}</span>
                  </div>
                </div>
              )}
            </div>

            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
              <h4 style={{ fontSize: '0.9rem' }}>Maintenance Details</h4>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <div>
                <label className="form-label">Service Type *</label>
                <select
                  name="serviceType"
                  value={formData.serviceType}
                  onChange={handleChange}
                  required
                  className="form-input"
                >
                  <option value="">Select type</option>
                  {SERVICE_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="form-label">Scheduled Date *</label>
                <input
                  type="date"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Workshop</label>
              <input
                type="text"
                name="workshop"
                value={formData.workshop}
                onChange={handleChange}
                placeholder="e.g. ABC Garage"
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Estimated Cost ($)</label>
              <input
                type="number"
                name="estimatedCost"
                value={formData.estimatedCost}
                onChange={handleChange}
                min="0"
                placeholder="0.00"
                className="form-input"
              />
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label className="form-label">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="3"
                placeholder="Details about the required maintenance..."
                className="form-input"
                style={{ resize: 'vertical' }}
              ></textarea>
            </div>
          </div>
          
          <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn-primary"
              style={{ background: 'transparent', border: '1px solid var(--border-color)', width: 'auto' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{ width: 'auto' }}
            >
              {loading ? 'Creating...' : 'Save Maintenance'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MaintenanceForm;
