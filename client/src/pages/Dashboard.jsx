import React, { useState, useEffect, useCallback } from 'react';
import KPICard from '../components/Dashboard/KPICard';
import TripStatusChart from '../components/Dashboard/Charts/TripStatusChart';
import FuelCostChart from '../components/Dashboard/Charts/FuelCostChart';
import RevenueExpenseChart from '../components/Dashboard/Charts/RevenueExpenseChart';
import VehicleTypeChart from '../components/Dashboard/Charts/VehicleTypeChart';
import FleetUtilizationChart from '../components/Dashboard/Charts/FleetUtilizationChart';
import Alerts from '../components/Dashboard/Alerts';
import { Truck, CheckCircle, Wrench, Route, Clock, Users, Activity, Map } from 'lucide-react';
import { getDashboardKPIs } from '../services/dashboardApi';
import { getChartData } from '../services/analyticsApi';
import './Dashboard.css';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    status: '',
    region: ''
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const kpiRes = await getDashboardKPIs(filters);
      const chartRes = await getChartData();
      
      if (kpiRes.success) setKpis(kpiRes.data);
      if (chartRes.success) setChartData(chartRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    setLoading(true);
    fetchDashboardData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [fetchDashboardData]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleClearFilters = () => {
    setFilters({ type: '', status: '', region: '' });
  };

  const hasActiveFilters = filters.type || filters.status || filters.region;

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h2>TransitOps Dashboard</h2>
        <p>Real-time insights into fleet operations</p>
      </div>

      {/* Dashboard Filters */}
      <div className="dashboard-filters card" style={{ marginBottom: '1.5rem', padding: '1rem 1.5rem' }}>
        <div className="filters-bar">
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="form-input filter-input"
          >
            <option value="">All Vehicle Types</option>
            <option value="Truck">Truck</option>
            <option value="Van">Van</option>
            <option value="Mini Truck">Mini Truck</option>
            <option value="Pickup">Pickup</option>
          </select>

          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="form-input filter-input"
          >
            <option value="">All Statuses</option>
            <option value="Available">Available</option>
            <option value="On Trip">On Trip</option>
            <option value="In Shop">In Shop</option>
            <option value="Retired">Retired</option>
          </select>

          <input
            type="text"
            name="region"
            placeholder="Filter by Region"
            value={filters.region}
            onChange={handleFilterChange}
            className="form-input filter-input"
          />

          {hasActiveFilters && (
            <button
              onClick={handleClearFilters}
              className="btn-outline"
              style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
            >
              ✕ Clear Filters
            </button>
          )}
        </div>
      </div>

      {kpis && (
        <div className="kpi-grid">
          <KPICard title="Active Vehicles" value={kpis.activeVehicles} icon={<Truck size={20} />} />
          <KPICard title="Available Vehicles" value={kpis.availableVehicles} icon={<CheckCircle size={20} />} />
          <KPICard title="Vehicles in Shop" value={kpis.vehiclesInShop} icon={<Wrench size={20} />} />
          <KPICard title="Vehicles On Trip" value={kpis.onTripVehicles} icon={<Map size={20} />} />
          <KPICard title="Active Trips" value={kpis.activeTrips} icon={<Route size={20} />} />
          <KPICard title="Pending Trips" value={kpis.pendingTrips} icon={<Clock size={20} />} />
          <KPICard title="Drivers on Duty" value={kpis.driversOnDuty} icon={<Users size={20} />} />
          <KPICard title="Fleet Utilization" value={`${kpis.fleetUtilization}%`} icon={<Activity size={20} />} />
        </div>
      )}

      <div className="dashboard-main-grid">
        <div className="grid-item">
          {kpis && <FleetUtilizationChart utilization={kpis.fleetUtilization} />}
        </div>
        <div className="grid-item">
          {chartData && <TripStatusChart data={chartData.tripStatus} />}
        </div>
        
        <div className="grid-item alerts-sidebar" style={{ gridRow: 'span 2' }}>
          <Alerts alerts={kpis?.alerts || []} />
        </div>

        <div className="grid-item">
          {chartData && <FuelCostChart data={chartData.fuelTrend} />}
        </div>
        <div className="grid-item">
          {chartData && <RevenueExpenseChart data={chartData.revenueVsExpense} />}
        </div>

        <div className="grid-item" style={{ gridColumn: 'span 3' }}>
          {chartData && <VehicleTypeChart data={chartData.vehicleType} />}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
