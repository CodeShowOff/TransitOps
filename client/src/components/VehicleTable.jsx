import React from 'react';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'On Trip': return 'status-ontrip';
      case 'In Shop': return 'status-inshop';
      case 'Retired': return 'status-retired';
      default: return '';
    }
  };

  return (
    <span className={`status-badge ${getBadgeClass()}`}>
      {status}
    </span>
  );
};

const VehicleTable = ({ vehicles, onView, onEdit, onDelete }) => {
  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager');

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Vehicle Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Odometer</th>
            <th>Acquisition Cost</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {vehicle.registrationNumber}
              </td>
              <td>{vehicle.model}</td>
              <td>{vehicle.type}</td>
              <td>{vehicle.maxLoadCapacity} kg</td>
              <td>{vehicle.odometer} km</td>
              <td>₹{vehicle.acquisitionCost ? vehicle.acquisitionCost.toLocaleString() : '0'}</td>
              <td>
                <StatusBadge status={vehicle.status} />
              </td>
              <td>
                <div className="action-buttons-cell">
                  <button
                    onClick={() => onView(vehicle)}
                    className="icon-btn view"
                    title="View"
                  >
                    <Eye size={18} />
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="icon-btn edit"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(vehicle)}
                        className="icon-btn delete"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
          {vehicles.length === 0 && (
            <tr>
              <td colSpan="8" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No vehicles found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
