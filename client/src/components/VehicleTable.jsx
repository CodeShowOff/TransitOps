import React from 'react';
import { Eye, Edit, Trash2, Truck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const StatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'Available': return 'badge-available';
      case 'On Trip': return 'badge-ontrip';
      case 'In Shop': return 'badge-inshop';
      case 'Retired': return 'badge-retired';
      default: return '';
    }
  };

  return (
    <span className={`badge-glow ${getBadgeClass()}`}>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        {status === 'Available' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
        {status === 'On Trip' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
        {status === 'In Shop' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
        {status === 'Retired' && <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}
        {status}
      </span>
    </span>
  );
};

const VehicleTable = ({ vehicles, onView, onEdit, onDelete }) => {
  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager');

  return (
    <div className="ai-table-container">
      <table className="ai-data-table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Vehicle Details</th>
            <th>Capacity</th>
            <th>Odometer</th>
            <th>Value</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {vehicles.map((vehicle) => (
            <tr key={vehicle._id}>
              <td>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)', letterSpacing: '0.03em' }}>
                    {vehicle.registrationNumber}
                  </span>
                </div>
              </td>
              <td>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ 
                    width: '36px', height: '36px', 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    borderRadius: '10px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: 'var(--brand-primary)' 
                  }}>
                    <Truck size={18} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 600 }}>{vehicle.model}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{vehicle.type}</span>
                  </div>
                </div>
              </td>
              <td style={{ color: 'var(--text-secondary)' }}>{vehicle.maxLoadCapacity.toLocaleString()} kg</td>
              <td style={{ color: 'var(--text-secondary)' }}>
                <span style={{ fontFamily: 'monospace', fontSize: '0.95rem' }}>
                  {vehicle.odometer.toLocaleString()}
                </span> <span style={{ fontSize: '0.75rem' }}>km</span>
              </td>
              <td style={{ fontWeight: 500, color: 'var(--brand-primary)' }}>
                ${vehicle.acquisitionCost ? vehicle.acquisitionCost.toLocaleString() : '0'}
              </td>
              <td>
                <StatusBadge status={vehicle.status} />
              </td>
              <td>
                <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                  <button
                    onClick={() => onView(vehicle)}
                    className="ai-icon-btn view"
                    title="View Details"
                  >
                    <Eye size={18} />
                  </button>
                  {canManage && (
                    <>
                      <button
                        onClick={() => onEdit(vehicle)}
                        className="ai-icon-btn edit"
                        title="Edit Vehicle"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => onDelete(vehicle)}
                        className="ai-icon-btn delete"
                        title="Retire Vehicle"
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
              <td colSpan="7" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <Truck size={48} opacity={0.2} />
                  <p>No vehicles found matching your criteria.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default VehicleTable;
