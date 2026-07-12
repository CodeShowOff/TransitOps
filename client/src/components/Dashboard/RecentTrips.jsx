import React from 'react';
import './DashboardComponents.css'; // Optional, but let's use it if needed or just use standard classes

const RecentTrips = ({ trips }) => {
  if (!trips || trips.length === 0) {
    return (
      <div className="recent-trips-container">
        <h3>Recent Trips</h3>
        <div className="no-data">No recent trips available</div>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'On Trip': return '#3b82f6';
      case 'Completed': return '#65a30d';
      case 'Dispatched': return '#0ea5e9';
      case 'Cancelled': return '#ef4444';
      case 'Draft': return '#71717a';
      default: return '#71717a';
    }
  };

  const calculateETA = (trip) => {
    if (trip.status === 'Completed') return '—';
    if (trip.status === 'Draft') return 'Awaiting vehicle';
    // Dummy ETA for now as the exact field might vary, we can use a placeholder
    return '45 min'; // In a real app we'd calculate based on distance/speed or API
  };

  return (
    <div className="recent-trips-container">
      <h3>Recent Trips</h3>
      <div className="table-responsive">
        <table className="recent-trips-table">
          <thead>
            <tr>
              <th>TRIP</th>
              <th>VEHICLE</th>
              <th>DRIVER</th>
              <th>STATUS</th>
              <th>ETA</th>
            </tr>
          </thead>
          <tbody>
            {trips.map((trip) => (
              <tr key={trip._id}>
                <td>{trip.tripNumber || trip._id.toString().slice(-5).toUpperCase()}</td>
                <td>{trip.vehicle?.registrationNumber || '—'}</td>
                <td>{trip.driver?.name || '—'}</td>
                <td>
                  <span
                    className="status-pill"
                    style={{ backgroundColor: getStatusColor(trip.status), color: '#fff' }}
                  >
                    {trip.status}
                  </span>
                </td>
                <td>{calculateETA(trip)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTrips;
