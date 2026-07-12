import React, { useState, useEffect, useRef } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { getAnalyticsMetrics } from '../services/analyticsApi';
import './Analytics.css';

const Analytics = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ dateRange: '', vehicle: '', driver: '', region: '' });

  const fetchAnalytics = async () => {
    try {
      const res = await getAnalyticsMetrics();
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
  }, []);

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

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
    addLine('Total Fuel Cost', `$${metrics.fuelCost}`);
    addLine('Maintenance Cost', `$${metrics.maintenanceCost}`);
    addLine('Other Expenses', `$${metrics.expense}`);
    addLine('Total Revenue', `$${metrics.revenue}`);
    addLine('Net Profit', `$${metrics.profit}`);
    addLine('ROI', `${metrics.roi}`);
    
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, yPos + 10);
    doc.save('analytics-report.pdf');
  };

  const csvData = metrics ? [
    ['Metric', 'Value'],
    ['Fuel Efficiency (km/L)', metrics.fuelEfficiency],
    ['Total Fuel Cost ($)', metrics.fuelCost],
    ['Maintenance Cost ($)', metrics.maintenanceCost],
    ['Other Expenses ($)', metrics.expense],
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
        <h3>Report Filters</h3>
        <div className="filters-grid">
          <div className="form-group">
            <label>Date Range</label>
            <input type="month" name="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="form-control" />
          </div>
          <div className="form-group">
            <label>Vehicle Type</label>
            <select name="vehicle" value={filters.vehicle} onChange={handleFilterChange} className="form-control">
              <option value="">All Vehicles</option>
              <option value="Truck">Truck</option>
              <option value="Van">Van</option>
            </select>
          </div>
          <div className="form-group">
            <label>Driver Status</label>
            <select name="driver" value={filters.driver} onChange={handleFilterChange} className="form-control">
              <option value="">All Drivers</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
            </select>
          </div>
          <div className="form-group">
            <label>Region</label>
            <select name="region" value={filters.region} onChange={handleFilterChange} className="form-control">
              <option value="">All Regions</option>
              <option value="North">North</option>
              <option value="South">South</option>
            </select>
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
