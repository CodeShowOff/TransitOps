import React, { useState, useEffect } from 'react';
import { createExpense } from '../services/expenseApi';
import { getVehicles } from '../services/vehicleApi';
import { getTrips } from '../services/tripApi';
import SearchableSelect from './SearchableSelect';

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
            <SearchableSelect 
              name="vehicle"
              value={formData.vehicle}
              onChange={handleChange}
              placeholder="Select Vehicle"
              options={Array.isArray(vehicles) ? vehicles.map(v => ({
                value: v._id,
                label: v.registrationNumber
              })) : []}
              required 
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Trip (Optional)</label>
            <SearchableSelect 
              name="trip"
              value={formData.trip}
              onChange={handleChange}
              placeholder="Select Trip"
              options={Array.isArray(trips) ? trips.map(t => ({
                value: t._id,
                label: t.tripNumber
              })) : []}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Expense Category *</label>
            <SearchableSelect 
              name="category"
              value={formData.category}
              onChange={handleChange}
              placeholder="Select Category"
              options={[
                { value: "Toll", label: "Toll" },
                { value: "Maintenance", label: "Maintenance" },
                { value: "Parking", label: "Parking" },
                { value: "Repair", label: "Repair" },
                { value: "Other", label: "Other" }
              ]}
              required 
            />
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
