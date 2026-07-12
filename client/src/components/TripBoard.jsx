import React, { useState, useEffect } from 'react';
import { Play, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { getTrips, dispatchTrip, cancelTrip, deleteTripDraft } from '../services/tripApi';
import CompleteTripModal from './CompleteTripModal';

const TripBoard = ({ refreshTrigger }) => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingTrip, setCompletingTrip] = useState(null); // Trip to complete
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTrips();
  }, [refreshTrigger]);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await getTrips();
      // Adjust according to API response struct
      setTrips(res.data || res);
    } catch (err) {
      console.error('Failed to fetch trips:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (actionFn, id, actionName) => {
    if (!window.confirm(`Are you sure you want to ${actionName} this trip?`)) return;
    setError(null);
    try {
      await actionFn(id);
      fetchTrips();
    } catch (err) {
      setError(err.response?.data?.message || `Failed to ${actionName} trip`);
    }
  };

  const onCompleteClose = () => {
    setCompletingTrip(null);
  };

  if (loading) return <div style={{ color: 'white' }}>Loading trips...</div>;

  return (
    <div className="trip-board">
      <h2 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', color: 'white' }}>Live Board</h2>
      
      {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}
      
      <div className="trip-list">
        {trips.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No trips found.</p>
        ) : (
          trips.map(trip => (
            <div className="trip-card" key={trip._id}>
              <div>
                <div className="trip-card-header">
                  <span className="trip-number">{trip.tripNumber}</span>
                  <span className={`trip-status status-${trip.status}`}>{trip.status}</span>
                </div>
                <div className="trip-details">
                  <div><strong>From:</strong> {trip.source}</div>
                  <div><strong>To:</strong> {trip.destination}</div>
                  <div><strong>Vehicle:</strong> {trip.vehicle?.registrationNumber || 'Unknown'}</div>
                  <div><strong>Driver:</strong> {trip.driver?.name || 'Unknown'}</div>
                  <div><strong>Cargo:</strong> {trip.cargoWeight} kg</div>
                  <div><strong>Distance:</strong> {trip.plannedDistance} km</div>
                </div>
              </div>
              <div className="trip-actions">
                {trip.status === 'Draft' && (
                  <>
                    <button 
                      className="btn-primary btn-small" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}
                      onClick={() => handleAction(dispatchTrip, trip._id, 'dispatch')}
                    >
                      <Play size={14} /> Dispatch
                    </button>
                    <button 
                      className="btn-secondary btn-small" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', borderColor: 'var(--error)', color: 'var(--error)' }}
                      onClick={() => handleAction(cancelTrip, trip._id, 'cancel')}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                    <button 
                      className="btn-secondary btn-small" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center' }}
                      onClick={() => handleAction(deleteTripDraft, trip._id, 'delete')}
                    >
                      <Trash2 size={14} /> Delete
                    </button>
                  </>
                )}
                {trip.status === 'Dispatched' && (
                  <>
                    <button 
                      className="btn-primary btn-small" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', background: 'var(--success)' }}
                      onClick={() => setCompletingTrip(trip)}
                    >
                      <CheckCircle size={14} /> Complete
                    </button>
                    <button 
                      className="btn-secondary btn-small" 
                      style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', justifyContent: 'center', borderColor: 'var(--error)', color: 'var(--error)' }}
                      onClick={() => handleAction(cancelTrip, trip._id, 'cancel')}
                    >
                      <XCircle size={14} /> Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {completingTrip && (
        <CompleteTripModal 
          trip={completingTrip} 
          onClose={onCompleteClose} 
          onComplete={fetchTrips} 
        />
      )}
    </div>
  );
};

export default TripBoard;
