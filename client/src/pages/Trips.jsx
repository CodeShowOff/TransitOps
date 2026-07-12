import React, { useState } from 'react';
import TripForm from '../components/TripForm';
import TripBoard from '../components/TripBoard';
import './Trips.css';

const Trips = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleTripCreated = () => {
    // Trigger board refresh
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Trip Management</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Manage the complete lifecycle of transport trips.</p>
      </div>

      <div className="trips-layout">
        <div className="trip-form-panel">
          <TripForm onTripCreated={handleTripCreated} />
        </div>
        <div className="trip-board-panel">
          <TripBoard refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Trips;
