import React from 'react';

const DriverStatusBadge = ({ status }) => {
  let color = 'gray';
  
  switch (status) {
    case 'Available':
      color = 'green';
      break;
    case 'On Trip':
      color = 'blue';
      break;
    case 'Off Duty':
      color = 'gray';
      break;
    case 'Suspended':
      color = 'orange';
      break;
    default:
      color = 'gray';
  }

  return (
    <span style={{ 
      color: color, 
      fontWeight: 'bold',
      padding: '2px 8px',
      border: `1px solid ${color}`,
      borderRadius: '4px'
    }}>
      {status}
    </span>
  );
};

export default DriverStatusBadge;
