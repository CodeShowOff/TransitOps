import React, { useState } from 'react';
import { Truck, Navigation, Settings } from 'lucide-react';
import { completeTrip } from '../services/tripApi';

const CompleteTripModal = ({ trip, onClose, onComplete }) => {
  const [formData, setFormData] = useState({
    actualDistance: trip.plannedDistance || '',
    fuelConsumed: '',
    fuelPrice: '',
    revenue: trip.revenue || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await completeTrip(trip._id, formData);
      onComplete(); // refresh parent
      onClose(); // close modal
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete trip');
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2 className="modal-title">Complete Trip {trip.tripNumber}</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Actual Distance (km) *</label>
            <input
              type="number"
              name="actualDistance"
              className="form-input"
              value={formData.actualDistance}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fuel Consumed (Liters) *</label>
            <input
              type="number"
              name="fuelConsumed"
              className="form-input"
              value={formData.fuelConsumed}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Fuel Price (per Liter) *</label>
            <input
              type="number"
              name="fuelPrice"
              className="form-input"
              value={formData.fuelPrice}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Final Revenue (₹)</label>
            <input
              type="number"
              name="revenue"
              className="form-input"
              value={formData.revenue}
              onChange={handleChange}
            />
          </div>
          <div className="action-buttons">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Completing...' : 'Complete Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompleteTripModal;
