import React, { useState, useEffect } from 'react';
import { createFuelLog } from '../services/fuelApi';
import { getVehicles } from '../services/vehicleApi';
import { getTrips } from '../services/tripApi';

const FuelForm = ({ onClose, onComplete }) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    trip: '',
    liters: '',
    fuelPrice: '',
    odometer: ''
  });
  
  const [vehicles, setVehicles] = useState([]);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  const fetchOptions = async () => {
    try {
      const vRes = await getVehicles();
      const tRes = await getTrips({ status: 'Completed' }); // Usually associate fuel with completed trips, or any
      setVehicles(vRes.data || vRes);
      setTrips(tRes.data || tRes);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const liters = Number(formData.liters);
      const fuelPrice = Number(formData.fuelPrice);
      const cost = liters * fuelPrice;

      await createFuelLog({
        vehicle: formData.vehicle,
        trip: formData.trip || undefined,
        liters,
        fuelPrice,
        cost,
        odometer: Number(formData.odometer)
      });
      onComplete();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create fuel log');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Fuel Record</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Vehicle *</label>
            <select name="vehicle" className="form-input" value={formData.vehicle} onChange={handleChange} required>
              <option value="">Select Vehicle</option>
              {Array.isArray(vehicles) && vehicles.map(v => (
                <option key={v._id} value={v._id}>{v.registrationNumber}</option>
              ))}
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Trip (Optional)</label>
            <select name="trip" className="form-input" value={formData.trip} onChange={handleChange}>
              <option value="">Select Trip</option>
              {Array.isArray(trips) && trips.map(t => (
                <option key={t._id} value={t._id}>{t.tripNumber} ({t.source} to {t.destination})</option>
              ))}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label className="form-label">Fuel Filled (Liters) *</label>
              <input type="number" name="liters" className="form-input" value={formData.liters} onChange={handleChange} required />
            </div>
            
            <div className="form-group">
              <label className="form-label">Fuel Price/Litre (₹) *</label>
              <input type="number" name="fuelPrice" className="form-input" value={formData.fuelPrice} onChange={handleChange} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Total Cost (₹)</label>
            <input 
              type="text" 
              className="form-input" 
              value={formData.liters && formData.fuelPrice ? `₹${(Number(formData.liters) * Number(formData.fuelPrice)).toLocaleString()}` : ''} 
              disabled 
            />
            <small style={{ color: 'var(--text-muted)' }}>Calculated automatically</small>
          </div>
          
          <div className="form-group">
            <label className="form-label">Current Odometer (km) *</label>
            <input type="number" name="odometer" className="form-input" value={formData.odometer} onChange={handleChange} required />
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FuelForm;
