import React, { useState, useEffect } from 'react';
import KPICard from '../components/Dashboard/KPICard';
import TripStatusChart from '../components/Dashboard/Charts/TripStatusChart';
import FuelCostChart from '../components/Dashboard/Charts/FuelCostChart';
import RevenueExpenseChart from '../components/Dashboard/Charts/RevenueExpenseChart';
import VehicleTypeChart from '../components/Dashboard/Charts/VehicleTypeChart';
import FleetUtilizationChart from '../components/Dashboard/Charts/FleetUtilizationChart';
import Alerts from '../components/Dashboard/Alerts';
import { getDashboardKPIs } from '../services/dashboardApi';
import { getChartData } from '../services/analyticsApi';
import './Dashboard.css';

const Dashboard = () => {
  const [kpis, setKpis] = useState(null);
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const kpiRes = await getDashboardKPIs();
      const chartRes = await getChartData();
      
      if (kpiRes.success) setKpis(kpiRes.data);
      if (chartRes.success) setChartData(chartRes.data);
    } catch (error) {
      console.error('Error fetching dashboard data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
    
    // Poll every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) return <div className="loading-screen">Loading Dashboard...</div>;

  return (
    <div className="dashboard-page fade-in">
      <div className="page-header">
        <h2>TransitOps Dashboard</h2>
        <p>Real-time insights into fleet operations</p>
      </div>

      {kpis && (
        <div className="kpi-grid">
          <KPICard title="Active Vehicles" value={kpis.activeVehicles} color="#3b82f6" icon="🚚" />
          <KPICard title="Available Vehicles" value={kpis.availableVehicles} color="#22c55e" icon="✅" />
          <KPICard title="Vehicles in Shop" value={kpis.vehiclesInShop} color="#ef4444" icon="🔧" />
          <KPICard title="Active Trips" value={kpis.activeTrips} color="#8b5cf6" icon="🛣️" />
          <KPICard title="Pending Trips" value={kpis.pendingTrips} color="#f59e0b" icon="⏳" />
          <KPICard title="Drivers on Duty" value={kpis.driversOnDuty} color="#14b8a6" icon="👷" />
        </div>
      )}

      <div className="dashboard-main-grid">
        <div className="charts-column">
          <div className="charts-row">
            {kpis && <FleetUtilizationChart utilization={kpis.fleetUtilization} />}
            {chartData && <TripStatusChart data={chartData.tripStatus} />}
          </div>
          <div className="charts-row">
            {chartData && <FuelCostChart data={chartData.fuelTrend} />}
            {chartData && <RevenueExpenseChart data={chartData.revenueVsExpense} />}
          </div>
          <div className="charts-row">
             {chartData && <VehicleTypeChart data={chartData.vehicleType} />}
          </div>
        </div>
        
        <div className="sidebar-column">
          <Alerts />
          {/* Can add Recent Trips table here as per wireframe */}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
