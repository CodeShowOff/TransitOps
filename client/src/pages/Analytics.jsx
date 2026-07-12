import React, { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import jsPDF from 'jspdf';
import { getAnalyticsMetrics } from '../services/analyticsApi';
import { 
  Download, FileText, X, TrendingUp, Droplets, 
  Activity, Wrench, DollarSign, PieChart, Briefcase, 
  Filter
} from 'lucide-react';
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
    
    // Header
    doc.setFillColor(30, 30, 45);
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(22);
    doc.setFont('helvetica', 'bold');
    doc.text('TransitOps Analytics Report', 20, 25);
    
    // Details
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, 50);
    
    // Active Filters
    let yPos = 65;
    if (hasActiveFilters) {
      doc.setFontSize(12);
      doc.setFont('helvetica', 'bold');
      doc.text('Applied Filters:', 20, yPos);
      yPos += 8;
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      if (filters.dateRange) { doc.text(`Date Range: ${filters.dateRange}`, 25, yPos); yPos += 6; }
      if (filters.vehicleType) { doc.text(`Vehicle Type: ${filters.vehicleType}`, 25, yPos); yPos += 6; }
      if (filters.driverStatus) { doc.text(`Driver Status: ${filters.driverStatus}`, 25, yPos); yPos += 6; }
      if (filters.region) { doc.text(`Region: ${filters.region}`, 25, yPos); yPos += 6; }
      yPos += 5;
    }

    // Metrics Table
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Financial & Operational Summary', 20, yPos);
    yPos += 8;
    
    const drawRow = (label, value, isHeader = false) => {
      doc.setDrawColor(200, 200, 200);
      if (isHeader) {
        doc.setFillColor(240, 240, 240);
        doc.rect(20, yPos, 170, 10, 'FD');
        doc.setFont('helvetica', 'bold');
      } else {
        doc.rect(20, yPos, 170, 10, 'D');
        doc.setFont('helvetica', 'normal');
      }
      doc.text(label, 25, yPos + 7);
      doc.text(String(value), 100, yPos + 7);
      yPos += 10;
    };

    drawRow('Metric', 'Value', true);
    drawRow('Fuel Efficiency', `${metrics.fuelEfficiency} km/L`);
    drawRow('Fleet Utilization', `${metrics.fleetUtilization}%`);
    drawRow('Total Fuel Cost', `₹${metrics.fuelCost.toLocaleString()}`);
    drawRow('Maintenance Cost', `₹${metrics.maintenanceCost.toLocaleString()}`);
    drawRow('Other Expenses', `₹${metrics.expense.toLocaleString()}`);
    drawRow('Operational Cost', `₹${metrics.operationalCost.toLocaleString()}`);
    drawRow('Total Revenue', `₹${metrics.revenue.toLocaleString()}`);
    drawRow('Net Profit', `₹${metrics.profit.toLocaleString()}`);
    drawRow('Return on Investment (ROI)', metrics.roi);

    doc.save('transitops-analytics-report.pdf');
  };

  const csvData = metrics ? [
    ['Metric', 'Value'],
    ['Fuel Efficiency (km/L)', metrics.fuelEfficiency],
    ['Fleet Utilization (%)', metrics.fleetUtilization],
    ['Total Fuel Cost (₹)', metrics.fuelCost],
    ['Maintenance Cost (₹)', metrics.maintenanceCost],
    ['Other Expenses (₹)', metrics.expense],
    ['Operational Cost (₹)', metrics.operationalCost],
    ['Total Revenue (₹)', metrics.revenue],
    ['Net Profit (₹)', metrics.profit],
    ['ROI', metrics.roi],
  ] : [];

  if (loading) return <div className="loading-screen">Loading Analytics...</div>;

  return (
    <div className="analytics-page fade-in">
      <div className="page-header d-flex justify-content-between align-items-center">
        <div>
          <h2>Analytics & Reports</h2>
          <p className="text-muted">Comprehensive financial and operational reports</p>
        </div>
        <div className="export-actions">
          {metrics && (
            <CSVLink data={csvData} filename="analytics-report.csv" className="btn btn-outline">
              <FileText size={18} className="icon" /> Export CSV
            </CSVLink>
          )}
          <button className="btn btn-primary" onClick={exportPDF}>
            <Download size={18} className="icon" /> Export PDF
          </button>
        </div>
      </div>

      <div className="filters-section">
        <div className="filters-header">
          <h3><Filter size={18} /> Report Filters</h3>
          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn-clear"
            >
              <X size={14} /> Clear Filters
            </button>
          )}
        </div>
        <div className="filters-grid">
          <div className="form-group">
            <label>Date Range</label>
            <select name="dateRange" value={filters.dateRange} onChange={handleFilterChange} className="form-control">
              <option value="">All Time</option>
              <option value="today">Today</option>
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="this_month">This Month</option>
              <option value="last_month">Last Month</option>
              <option value="this_year">This Year</option>
            </select>
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
          <div className="metrics-header">
            <h3><Activity size={18} /> Financial Summary</h3>
          </div>
          <div className="metrics-grid">
            <div className="metric-box">
              <div className="metric-icon-wrap"><Droplets size={20} /></div>
              <div className="metric-content">
                <h4>Fuel Efficiency</h4>
                <p className="val">{metrics.fuelEfficiency} <span>km/L</span></p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon-wrap"><Activity size={20} /></div>
              <div className="metric-content">
                <h4>Fleet Utilization</h4>
                <p className="val">{metrics.fleetUtilization}<span>%</span></p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon-wrap"><DollarSign size={20} /></div>
              <div className="metric-content">
                <h4>Total Fuel Cost</h4>
                <p className="val">₹{metrics.fuelCost.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon-wrap"><Wrench size={20} /></div>
              <div className="metric-content">
                <h4>Maintenance Cost</h4>
                <p className="val">₹{metrics.maintenanceCost.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon-wrap"><Briefcase size={20} /></div>
              <div className="metric-content">
                <h4>Other Expenses</h4>
                <p className="val">₹{metrics.expense.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-icon-wrap"><PieChart size={20} /></div>
              <div className="metric-content">
                <h4>Operational Cost</h4>
                <p className="val">₹{metrics.operationalCost.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box highlight-success">
              <div className="metric-icon-wrap"><TrendingUp size={20} /></div>
              <div className="metric-content">
                <h4>Total Revenue</h4>
                <p className="val">₹{metrics.revenue.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box highlight-primary">
              <div className="metric-icon-wrap"><DollarSign size={20} /></div>
              <div className="metric-content">
                <h4>Net Profit</h4>
                <p className="val">₹{metrics.profit.toLocaleString()}</p>
              </div>
            </div>
            <div className="metric-box highlight-info">
              <div className="metric-icon-wrap"><TrendingUp size={20} /></div>
              <div className="metric-content">
                <h4>Return On Investment</h4>
                <p className="val">{metrics.roi}%</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Analytics;

