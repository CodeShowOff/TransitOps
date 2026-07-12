import React from 'react';
import MaintenanceStatusBadge from './MaintenanceStatusBadge';
import { Edit, Trash2, CheckSquare } from 'lucide-react';

const MaintenanceTable = ({ data, onComplete, onDelete }) => {
  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Service Type</th>
            <th>Workshop</th>
            <th>Scheduled Date</th>
            <th>Cost (Est/Act)</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan="7" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No maintenance records found.
              </td>
            </tr>
          ) : (
            data.map((record) => (
              <tr key={record._id}>
                <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                  {record.vehicle?.registrationNumber} <br />
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{record.vehicle?.model}</span>
                </td>
                <td>
                  {record.serviceType}
                </td>
                <td>
                  {record.workshop || '-'}
                </td>
                <td>
                  {new Date(record.scheduledDate).toLocaleDateString()}
                  {record.completedDate && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.25rem' }}>
                      Completed: {new Date(record.completedDate).toLocaleDateString()}
                    </div>
                  )}
                </td>
                <td>
                  ₹{record.estimatedCost || 0} / <span style={{ fontWeight: record.actualCost ? 600 : 400 }}>₹{record.actualCost || 0}</span>
                </td>
                <td>
                  <MaintenanceStatusBadge status={record.status} />
                </td>
                <td>
                  <div className="action-buttons-cell">
                    {record.status === 'Active' && (
                      <button
                        onClick={() => onComplete(record)}
                        className="icon-btn edit"
                        style={{ color: 'var(--success)' }}
                        title="Complete Maintenance"
                      >
                        <CheckSquare size={18} />
                      </button>
                    )}
                    {record.status === 'Active' && (
                      <button
                        onClick={() => onDelete(record._id)}
                        className="icon-btn delete"
                        title="Delete Record"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MaintenanceTable;
