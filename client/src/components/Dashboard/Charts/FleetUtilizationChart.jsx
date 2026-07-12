import React from 'react';

const FleetUtilizationChart = ({ utilization }) => {
  // Simple custom progress bar for fleet utilization
  return (
    <div className="chart-container utilization-container">
      <h3>Fleet Utilization</h3>
      <div className="utilization-gauge">
        <div className="utilization-value">{utilization}%</div>
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${utilization}%`, backgroundColor: utilization > 80 ? '#ef4444' : utilization > 50 ? '#f59e0b' : '#22c55e' }}
          ></div>
        </div>
        <p className="utilization-text">
          {utilization > 80 ? 'High Utilization' : utilization > 50 ? 'Optimal Utilization' : 'Low Utilization'}
        </p>
      </div>
    </div>
  );
};

export default FleetUtilizationChart;
