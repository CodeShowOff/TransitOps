import React from 'react';
import DriverStatusBadge from './DriverStatusBadge';

const DriverTable = ({ drivers, onEdit, onDelete, onRefresh }) => {
  if (!drivers || drivers.length === 0) {
    return <p>No drivers found.</p>;
  }

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }} border="1">
      <thead>
        <tr style={{ backgroundColor: '#f0f0f0' }}>
          <th>Driver Name</th>
          <th>Employee ID</th>
          <th>License Number</th>
          <th>Category</th>
          <th>Expiry</th>
          <th>Phone</th>
          <th>Score</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {drivers.map(driver => (
          <tr key={driver._id} style={{ textAlign: 'center' }}>
            <td>{driver.name}</td>
            <td>{driver.employeeId}</td>
            <td>{driver.licenseNumber}</td>
            <td>{driver.licenseCategory}</td>
            <td>{new Date(driver.licenseExpiry).toLocaleDateString()}</td>
            <td>{driver.phone}</td>
            <td>{driver.safetyScore}</td>
            <td><DriverStatusBadge status={driver.status} /></td>
            <td>
              <button onClick={() => onEdit(driver)}>Edit</button>
              <button onClick={() => onDelete(driver)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DriverTable;
