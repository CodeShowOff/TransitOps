import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { getAnalyticsMetrics } from '../services/analyticsApi';
import './Analytics.css';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    dateRange: '',
    vehicleType: '',
    driverStatus: '',
    region: ''
  });

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const res = await getAnalyticsMetrics(filters);
      if (res.success) {
        setMetrics(res.data);
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [filters]);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleClearFilters = () => {
    setFilters({ dateRange: '', vehicleType: '', driverStatus: '', region: '' });
  };

  const hasActiveFilters = filters.dateRange || filters.vehicleType || filters.driverStatus || filters.region;

  const exportPDF = () => {
    if (!metrics) return;
    const doc = new jsPDF();
    doc.setFontSize(20);
    doc.text('TransitOps Analytics Report', 20, 20);
    
    doc.setFontSize(12);
    let yPos = 40;
    const addLine = (label, value) => {
      doc.text(`${label}: ${value}`, 20, yPos);
      yPos += 10;
    };

    addLine('Fuel Efficiency', `${metrics.fuelEfficiency} km/L`);
    addLine('Fleet Utilization', `${metrics.fleetUtilization}%`);
    addLine('Total Fuel Cost', `$${metrics.fuelCost}`);
    addLine('Maintenance Cost', `$${metrics.maintenanceCost}`);
    addLine('Other Expenses', `$${metrics.expense}`);
    addLine('Operational Cost', `$${metrics.operationalCost}`);
    addLine('Total Revenue', `$${metrics.revenue}`);
    addLine('Net Profit', `$${metrics.profit}`);
    addLine('ROI', `${metrics.roi}`);

    // Add applied filters info
    yPos += 5;
    doc.setFontSize(10);
    if (filters.dateRange) addLine('Filter - Date Range', filters.dateRange);
    if (filters.vehicleType) addLine('Filter - Vehicle Type', filters.vehicleType);
    if (filters.driverStatus) addLine('Filter - Driver Status', filters.driverStatus);
    if (filters.region) addLine('Filter - Region', filters.region);
    
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos + 10);
    doc.save('analytics-report.pdf');
  };

  const csvData = metrics ? [
    ['Metric', 'Value'],
    ['Fuel Efficiency (km/L)', metrics.fuelEfficiency],
    ['Fleet Utilization (%)', metrics.fleetUtilization],
    ['Total Fuel Cost ($)', metrics.fuelCost],
    ['Maintenance Cost ($)', metrics.maintenanceCost],
    ['Other Expenses ($)', metrics.expense],
    ['Operational Cost ($)', metrics.operationalCost],
    ['Total Revenue ($)', metrics.revenue],
    ['Net Profit ($)', metrics.profit],
    ['ROI', metrics.roi],
  ] : [];

  if (loading) return <div className="loading-screen">Loading Analytics...</div>;

  return (
    <div className="analytics-page fade-in">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Analytics & Reports</h2>
          <p>Comprehensive financial and operational reports</p>
        </div>
        <div className="export-actions">
          {metrics && (
            <CSVLink data={csvData} filename="analytics-report.csv" className="btn btn-outline">
              📄 Export CSV
            </CSVLink>
          )}
          <button className="btn btn-primary" onClick={exportPDF}>
            📊 Export PDF
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Report Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn-outline"
              style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
        <div className="filters-grid">
          <div className="form-group">
            <label>Date Range</label>
            <input type="month" name="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicleType" value={filters.vehicleType} onChange={handleFilterChange} className="form-control">
              <option value="">All Vehicles</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
              <option value="Mini Truck">Mini Truck</option>
              <option value="Pickup">Pickup</option>
            </select>
          </div>
          <div className="form-group">
            <label>Driver Status</label>
            <select name="driverStatus" value={filters.driverStatus} onChange={handleFilterChange} className="form-control">
              <option value="">All Drivers</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          <div className="form-group">
            <label>Region</label>
            <input type="text" name="region" placeholder="Enter region" value={filters.region} onChange={handleFilterChange} className="form-control" />
          </div>
        </div>
      </div>

      {metrics && (
        <div className="metrics-summary">
          <h3>Financial Summary</h3>
          <div className="metrics-grid">
            <div className="metric-box bg-light">
              <h4>Fuel Efficiency</h4>
              <p className="val">{metrics.fuelEfficiency} <small>km/L</small></p>
            </div>
            <div className="metric-box bg-indigo-light">
              <h4>Fleet Utilization</h4>
              <p className="val">{metrics.fleetUtilization}<small>%</small></p>
            </div>
            <div className="metric-box bg-warning-light">
              <h4>Total Fuel Cost</h4>
              <p className="val">${metrics.fuelCost.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-danger-light">
              <h4>Maintenance Cost</h4>
              <p className="val">${metrics.maintenanceCost.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-info-light">
              <h4>Other Expenses</h4>
              <p className="val">${metrics.expense.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-orange-light">
              <h4>Operational Cost</h4>
              <p className="val">${metrics.operationalCost.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-success-light">
              <h4>Total Revenue</h4>
              <p className="val text-success">${metrics.revenue.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-primary-light">
              <h4>Net Profit</h4>
              <p className="val text-primary">${metrics.profit.toLocaleString()}</p>
            </div>
            <div className="metric-box bg-purple-light">
              <h4>Return on Investment</h4>
              <p className="val">{metrics.roi}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;
