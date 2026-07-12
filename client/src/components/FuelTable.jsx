import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const FuelTable = ({ fuelLogs, onDelete }) => {
  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager');

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Trip</th>
            <th>Liters</th>
            <th>Price / L</th>
            <th>Total Cost</th>
            <th>Odometer</th>
            <th>Date</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {fuelLogs.map((log) => (
            <tr key={log._id}>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {log.vehicle ? log.vehicle.registrationNumber : 'N/A'}
              </td>
              <td>{log.trip ? log.trip.tripNumber : 'N/A'}</td>
              <td>{log.liters} L</td>
              <td>₹{log.fuelPrice || 0}</td>
              <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                ₹{log.cost.toLocaleString()}
              </td>
              <td>{log.odometer} km</td>
              <td>{new Date(log.filledDate).toLocaleDateString()}</td>
              {canManage && (
                <td>
                  <div className="action-buttons-cell">
                    <button
                      onClick={() => onDelete(log)}
                      className="icon-btn delete"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {fuelLogs.length === 0 && (
            <tr>
              <td colSpan={canManage ? "8" : "7"} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No fuel logs found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FuelTable;
