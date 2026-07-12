import React from 'react';

const KPICard = ({ title, value, subtitle, icon, color = 'var(--text-secondary)' }) => {
  return (
    <div className="kpi-card">
      <div className="kpi-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 className="kpi-card-title" style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-secondary, #a1a1aa)', margin: 0 }}>
          {title}
        </h3>
        {icon && (
          <div className="kpi-card-icon" style={{ color: color, fontSize: '1.25rem', display: 'flex', alignItems: 'center', opacity: 0.8 }}>
            {icon}
          </div>
        )}
      </div>
      <div className="kpi-card-body">
        <p className="kpi-card-value" style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text-primary, #ffffff)', margin: 0, lineHeight: 1.2 }}>
          {value}
        </p>
        {subtitle && <p className="kpi-card-subtitle" style={{ fontSize: '0.875rem', color: 'var(--text-secondary, #a1a1aa)', marginTop: '0.25rem' }}>{subtitle}</p>}
      </div>
    </div>
  );
};

export default KPICard;
