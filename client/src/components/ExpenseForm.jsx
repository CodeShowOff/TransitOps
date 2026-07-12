import React, { useState, useEffect } from 'react';
import { createExpense } from '../services/expenseApi';
import { getVehicles } from '../services/vehicleApi';
import { getTrips } from '../services/tripApi';

const ExpenseForm = ({ onClose, onComplete }) => {
  const [formData, setFormData] = useState({
    vehicle: '',
    trip: '',
    category: '',
    description: '',
    amount: ''
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
      const tRes = await getTrips();
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
      await createExpense({
        ...formData,
        trip: formData.trip || undefined,
        amount: Number(formData.amount)
      });
      onComplete();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create expense');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Add Expense</h2>
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
                <option key={t._id} value={t._id}>{t.tripNumber}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Expense Category *</label>
            <select name="category" className="form-input" value={formData.category} onChange={handleChange} required>
              <option value="">Select Category</option>
              <option value="Toll">Toll</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Parking">Parking</option>
              <option value="Repair">Repair</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Description</label>
            <input type="text" name="description" className="form-input" value={formData.description} onChange={handleChange} />
          </div>
          
          <div className="form-group">
            <label className="form-label">Amount (₹) *</label>
            <input type="number" name="amount" className="form-input" value={formData.amount} onChange={handleChange} required />
          </div>

          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Expense'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseForm;
