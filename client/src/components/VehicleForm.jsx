import React, { useState, useEffect } from 'react';
import { X, Truck, Hash, Settings, Activity, MapPin } from 'lucide-react';

const VehicleForm = ({ isOpen, onClose, onSubmit, initialData = null }) => {
  const [formData, setFormData] = useState({
    registrationNumber: '',
    model: '',
    type: 'Truck',
    maxLoadCapacity: '',
    odometer: '',
    acquisitionCost: '',
    region: '',
    status: 'Available'
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        registrationNumber: '',
        model: '',
        type: 'Truck',
        maxLoadCapacity: '',
        odometer: '',
        acquisitionCost: '',
        region: '',
        status: 'Available'
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'maxLoadCapacity' || name === 'odometer' || name === 'acquisitionCost' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const isEditing = !!initialData;
  const isStatusLocked = initialData?.status === 'On Trip';

  return (
    <div className="modal-overlay">
      <div className="ai-modal-content">
        <div className="ai-modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '40px', height: '40px',
              background: 'rgba(59, 130, 246, 0.15)',
              borderRadius: '12px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'var(--brand-primary)',
              border: '1px solid rgba(59, 130, 246, 0.3)'
            }}>
              <Truck size={20} />
            </div>
            <div>
              <h2>{isEditing ? 'Update Vehicle' : 'Register Vehicle'}</h2>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0, marginTop: '0.1rem' }}>
                {isEditing ? 'Modify existing fleet asset details' : 'Add a new asset to the fleet'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="modal-close" style={{ alignSelf: 'flex-start' }}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="ai-modal-body">
            <div className="form-grid">
              
              <div className="ai-input-group full-width">
                <label className="ai-label">Registration Number <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Hash size={18} />
                  </div>
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    required
                    className="ai-input"
                    style={{ textTransform: 'uppercase', paddingLeft: '2.5rem' }}
                    placeholder="MH12AB1234"
                  />
                </div>
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Vehicle Name (Model) <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Truck size={18} />
                  </div>
                  <input
                    type="text"
                    name="model"
                    value={formData.model}
                    onChange={handleChange}
                    required
                    className="ai-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="E.g. Freightliner Cascadia"
                  />
                </div>
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Vehicle Type <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="ai-input ai-select"
                >
                  <option value="Truck">Truck</option>
                  <option value="Van">Van</option>
                  <option value="Mini Truck">Mini Truck</option>
                  <option value="Pickup">Pickup</option>
                </select>
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Maximum Capacity (kg) <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <input
                  type="number"
                  name="maxLoadCapacity"
                  value={formData.maxLoadCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="ai-input"
                  placeholder="1000"
                />
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Odometer (km) <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Activity size={18} />
                  </div>
                  <input
                    type="number"
                    name="odometer"
                    value={formData.odometer}
                    onChange={handleChange}
                    required
                    min="0"
                    className="ai-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Acquisition Cost ($) <span style={{ color: 'var(--brand-primary)' }}>*</span></label>
                <input
                  type="number"
                  name="acquisitionCost"
                  value={formData.acquisitionCost}
                  onChange={handleChange}
                  required
                  min="1"
                  className="ai-input"
                  placeholder="25000"
                />
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Region</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <MapPin size={18} />
                  </div>
                  <input
                    type="text"
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                    className="ai-input"
                    style={{ paddingLeft: '2.5rem' }}
                    placeholder="North"
                  />
                </div>
              </div>

              <div className="ai-input-group">
                <label className="ai-label">Status</label>
                <div style={{ position: 'relative' }}>
                  <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
                    <Settings size={18} />
                  </div>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    disabled={isStatusLocked}
                    className="ai-input ai-select"
                    style={{ 
                      opacity: isStatusLocked ? 0.6 : 1,
                      paddingLeft: '2.5rem',
                      cursor: isStatusLocked ? 'not-allowed' : 'pointer'
                    }}
                  >
                    <option value="Available">Available</option>
                    <option value="Retired">Retired</option>
                    {initialData?.status === 'On Trip' && <option value="On Trip">On Trip</option>}
                    {initialData?.status === 'In Shop' && <option value="In Shop">In Shop</option>}
                  </select>
                </div>
                {isStatusLocked && (
                  <div style={{ marginTop: '0.5rem', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '6px', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--error)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ display: 'inline-block', width: 4, height: 4, background: 'var(--error)', borderRadius: '50%' }}></span>
                      Status locked while vehicle is On Trip.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="ai-modal-footer">
            <button type="button" onClick={onClose} className="ai-btn-secondary">
              Cancel
            </button>
            <button type="submit" className="ai-btn-primary">
              {isEditing ? 'Save Changes' : 'Register Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
