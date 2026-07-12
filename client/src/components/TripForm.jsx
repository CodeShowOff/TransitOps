import React, { useState, useEffect } from 'react';
import { createTrip } from '../services/tripApi';
import { getDrivers } from '../services/driverAPI';
import { getVehicles } from '../services/vehicleApi';
import SearchableSelect from './SearchableSelect';

const TripForm = ({ onTripCreated }) => {
  const [formData, setFormData] = useState({
    source: '',
    destination: '',
    vehicle: '',
    driver: '',
    cargoWeight: '',
    plannedDistance: '',
    revenue: ''
  });

  const [vehicles, setVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      // Fetch only available vehicles and drivers
      // API should support query params: ?status=Available
      const vRes = await getVehicles({ status: 'Available' });
      const dRes = await getDrivers({ status: 'Available' });
      
      // Depending on API response structure, usually it's res.data for our wrappers
      setVehicles(vRes.data || vRes);
      setDrivers(dRes.data || dRes);
    } catch (err) {
      console.error('Failed to fetch vehicles/drivers:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createTrip({
        ...formData,
        cargoWeight: Number(formData.cargoWeight),
        plannedDistance: Number(formData.plannedDistance),
        revenue: formData.revenue ? Number(formData.revenue) : 0
      });
      setSuccess(true);
      setFormData({
        source: '',
        destination: '',
        vehicle: '',
        driver: '',
        cargoWeight: '',
        plannedDistance: '',
        revenue: ''
      });
      if (onTripCreated) onTripCreated();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trip-form">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'white' }}>Create New Trip</h2>
      
      <div className="lifecycle-indicator">
        <div className="lifecycle-step active">
          <div className="lifecycle-step-dot"></div>
          <span>Draft</span>
        </div>
        <div className="lifecycle-step">
          <div className="lifecycle-step-dot"></div>
          <span>Dispatched</span>
        </div>
        <div className="lifecycle-step">
          <div className="lifecycle-step-dot"></div>
          <span>Completed</span>
        </div>
        <div className="lifecycle-step">
          <div className="lifecycle-step-dot"></div>
          <span>Cancelled</span>
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}
      {success && <div className="success-message">Trip created successfully as Draft!</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Source *</label>
          <input type="text" name="source" className="form-input" value={formData.source} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Destination *</label>
          <input type="text" name="destination" className="form-input" value={formData.destination} onChange={handleChange} required />
        </div>
        
        <div className="form-group">
          <label className="form-label">Vehicle *</label>
          <SearchableSelect 
            name="vehicle"
            value={formData.vehicle}
            onChange={handleChange}
            placeholder="Select Available Vehicle"
            options={Array.isArray(vehicles) ? vehicles.filter(v => v.status === 'Available').map(v => ({
              value: v._id,
              label: `${v.registrationNumber} (${v.maxLoadCapacity}kg)`
            })) : []}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Driver *</label>
          <SearchableSelect 
            name="driver"
            value={formData.driver}
            onChange={handleChange}
            placeholder="Select Available Driver"
            options={Array.isArray(drivers) ? drivers.filter(d => d.status === 'Available').map(d => ({
              value: d._id,
              label: `${d.name} (${d.employeeId})`
            })) : []}
            required
          />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'flex-end' }}>
          <div className="form-group">
            <label className="form-label">Cargo Weight (kg) *</label>
            <input type="number" name="cargoWeight" className="form-input" value={formData.cargoWeight} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Planned Distance (km) *</label>
            <input type="number" name="plannedDistance" className="form-input" value={formData.plannedDistance} onChange={handleChange} required />
          </div>
        </div>
        
        <div className="form-group">
          <label className="form-label">Expected Revenue (Optional)</label>
          <input type="number" name="revenue" className="form-input" value={formData.revenue} onChange={handleChange} />
        </div>

        <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%' }}>
          {loading ? 'Creating...' : 'Save Draft'}
        </button>
      </form>
    </div>
  );
};

export default TripForm;
