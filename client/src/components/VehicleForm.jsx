import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import SearchableSelect from './SearchableSelect';

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
      <div className="modal-content">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Vehicle' : 'Add Vehicle'}</h2>
          <button onClick={onClose} className="modal-close">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              
              <div>
                <label className="form-label">Registration Number *</label>
                <input
                  type="text"
                  name="registrationNumber"
                  value={formData.registrationNumber}
                  onChange={handleChange}
                  required
                  className="form-input"
                  style={{ textTransform: 'uppercase' }}
                  placeholder="MH12AB1234"
                />
              </div>

              <div>
                <label className="form-label">Vehicle Name *</label>
                <input
                  type="text"
                  name="model"
                  value={formData.model}
                  onChange={handleChange}
                  required
                  className="form-input"
                  placeholder="VAN-05"
                />
              </div>

              <div>
                <label className="form-label">Vehicle Type *</label>
                <SearchableSelect
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  placeholder="Select Type"
                  options={[
                    { value: "Truck", label: "Truck" },
                    { value: "Van", label: "Van" },
                    { value: "Mini Truck", label: "Mini Truck" },
                    { value: "Pickup", label: "Pickup" }
                  ]}
                />
              </div>

              <div>
                <label className="form-label">Maximum Capacity (kg) *</label>
                <input
                  type="number"
                  name="maxLoadCapacity"
                  value={formData.maxLoadCapacity}
                  onChange={handleChange}
                  required
                  min="1"
                  className="form-input"
                  placeholder="1000"
                />
              </div>

              <div>
                <label className="form-label">Odometer (km) *</label>
                <input
                  type="number"
                  name="odometer"
                  value={formData.odometer}
                  onChange={handleChange}
                  required
                  min="0"
                  className="form-input"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="form-label">Acquisition Cost ($) *</label>
                <input
                  type="number"
                  name="acquisitionCost"
                  value={formData.acquisitionCost}
                  onChange={handleChange}
                  required
                  min="1"
                  className="form-input"
                  placeholder="25000"
                />
              </div>

              <div>
                <label className="form-label">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="North"
                />
              </div>

              <div>
                <label className="form-label">Status</label>
                <div style={{ opacity: isStatusLocked ? 0.5 : 1, pointerEvents: isStatusLocked ? 'none' : 'auto' }}>
                  <SearchableSelect
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    placeholder="Select Status"
                    options={[
                      { value: "Available", label: "Available" },
                      { value: "Retired", label: "Retired" },
                      ...(initialData?.status === 'On Trip' ? [{ value: "On Trip", label: "On Trip" }] : []),
                      ...(initialData?.status === 'In Shop' ? [{ value: "In Shop", label: "In Shop" }] : [])
                    ]}
                  />
                </div>
                {isStatusLocked && (
                  <p style={{ marginTop: '4px', fontSize: '12px', color: 'var(--error)' }}>
                    Status locked while On Trip.
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" onClick={onClose} className="btn-secondary">
              Cancel
            </button>
            <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
              {isEditing ? 'Save Changes' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
