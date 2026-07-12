import React from 'react';

const MaintenanceStatusBadge = ({ status }) => {
  let badgeClass = 'px-2 py-1 text-xs font-medium rounded-full ';
  
  if (status === 'Active') {
    badgeClass += 'bg-orange-100 text-orange-800 border border-orange-200';
  } else if (status === 'Completed') {
    badgeClass += 'bg-green-100 text-green-800 border border-green-200';
  } else {
    badgeClass += 'bg-gray-100 text-gray-800 border border-gray-200';
  }

  return (
    <span className={badgeClass}>
      {status}
    </span>
  );
};

export default MaintenanceStatusBadge;
