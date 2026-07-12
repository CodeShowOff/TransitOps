import React from 'react';

const KPICard = ({ title, value, subtitle, icon, color = 'var(--primary-color)' }) => {
  return (
    <div className="kpi-card" style={{ borderLeft: `4px solid ${color}` }}>
      <div className="kpi-card-content">
        <h3 className="kpi-card-title">{title}</h3>
        <p className="kpi-card-value">{value}</p>
        {subtitle && <p className="kpi-card-subtitle">{subtitle}</p>}
      </div>
      {icon && (
        <div className="kpi-card-icon" style={{ color: color }}>
          {icon}
        </div>
      )}
    </div>
  );
};

export default KPICard;
