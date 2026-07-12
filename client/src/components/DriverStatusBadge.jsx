import React from 'react';

const DriverStatusBadge = ({ status }) => {
  const getBadgeClass = () => {
    switch (status) {
      case 'Available': return 'badge-available';
      case 'On Trip': return 'badge-ontrip';
      case 'Off Duty': return 'badge-inshop';
      case 'Suspended': return 'badge-retired';
      default: return 'badge-inshop';
    }
  };

  return (
    <span className={`badge-glow ${getBadgeClass()}`}>
      <span style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />
        {status}
      </span>
    </span>
  );
};

export default DriverStatusBadge;
