import React from 'react';
import DriverStatusBadge from './DriverStatusBadge';
import { Edit, Trash2, User, IdCard, ShieldAlert, Phone } from 'lucide-react';

const DriverTable = ({ drivers, onEdit, onDelete, onRefresh }) => {
  return (
    <div className="ai-table-container">
      <table className="ai-data-table">
        <thead>
          <tr>
            <th>Driver Details</th>
            <th>License Info</th>
            <th>Contact</th>
            <th>Safety Score</th>
            <th>Status</th>
            <th style={{ textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drivers && drivers.length > 0 ? (
            drivers.map((driver) => (
              <tr key={driver._id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ 
                      width: '36px', height: '36px', 
                      background: 'rgba(139, 92, 246, 0.1)', 
                      borderRadius: '10px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: 'var(--brand-secondary)' 
                    }}>
                      <User size={18} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{driver.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        <IdCard size={12} /> ID: {driver.employeeId}
                      </span>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ fontWeight: 500, color: 'var(--text-primary)', letterSpacing: '0.02em' }}>
                      {driver.licenseNumber}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {driver.licenseCategory} &bull; Exp: {new Date(driver.licenseExpiry).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td style={{ color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <Phone size={14} /> {driver.phone}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldAlert size={16} color={driver.safetyScore >= 90 ? 'var(--success)' : driver.safetyScore >= 70 ? 'var(--brand-primary)' : 'var(--error)'} />
                    <span style={{ 
                      fontWeight: 600, 
                      color: driver.safetyScore >= 90 ? 'var(--success)' : driver.safetyScore >= 70 ? 'var(--text-primary)' : 'var(--error)'
                    }}>
                      {driver.safetyScore}
                    </span>
                  </div>
                </td>
                <td>
                  <DriverStatusBadge status={driver.status} />
                </td>
                <td>
                  <div className="action-buttons-cell" style={{ justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => onEdit(driver)}
                      className="ai-icon-btn edit"
                      title="Edit Driver"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => onDelete(driver)}
                      className="ai-icon-btn delete"
                      title="Remove Driver"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                  <User size={48} opacity={0.2} />
                  <p>No drivers found matching your criteria.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default DriverTable;
