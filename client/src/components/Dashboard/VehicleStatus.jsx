import React from 'react';

const VehicleStatus = ({ kpis }) => {
  if (!kpis) return null;

  const { availableVehicles, onTripVehicles, vehiclesInShop, retiredVehicles, totalVehicles } = kpis;

  const statuses = [
    { label: 'Available', value: availableVehicles, color: '#22c55e' }, // Green
    { label: 'On Trip', value: onTripVehicles, color: '#3b82f6' }, // Blue
    { label: 'In Shop', value: vehiclesInShop, color: '#f97316' }, // Orange
    { label: 'Retired', value: retiredVehicles || 0, color: '#ef4444' } // Red
  ];

  // We should scale the bars based on totalVehicles, or just relative to the highest.
  // Using totalVehicles makes the bars proportional to the fleet.
  const maxVal = totalVehicles || 1;

  return (
    <div className="vehicle-status-container">
      <h3>Vehicle Status</h3>
      <div className="status-bars">
        {statuses.map((status) => (
          <div key={status.label} className="status-row">
            <div className="status-label">{status.label}</div>
            <div className="status-bar-bg">
              <div
                className="status-bar-fill"
                style={{
                  width: `${(status.value / maxVal) * 100}%`,
                  backgroundColor: status.color,
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VehicleStatus;
