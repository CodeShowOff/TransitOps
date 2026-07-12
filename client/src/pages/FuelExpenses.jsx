import React, { useState, useEffect } from 'react';
import { Plus, Droplets, Wrench, FileText, Activity } from 'lucide-react';
import CostSummaryCard from '../components/CostSummaryCard';
import FuelTable from '../components/FuelTable';
import ExpenseTable from '../components/ExpenseTable';
import FuelForm from '../components/FuelForm';
import ExpenseForm from '../components/ExpenseForm';
import { getFuelLogs, deleteFuelLog } from '../services/fuelApi';
import { getExpenses, deleteExpense, getExpenseSummary } from '../services/expenseApi';
import { useAuth } from '../context/AuthContext';
import './Trips.css'; // Borrowing tabs styling from trips if available

const FuelExpenses = () => {
  const [activeTab, setActiveTab] = useState('fuel'); // 'fuel' or 'expenses'
  
  const [summary, setSummary] = useState({
    fuelCost: 0,
    maintenanceCost: 0,
    otherExpenses: 0,
    operationalCost: 0,
    averageFuelEfficiency: 0
  });

  const [fuelLogs, setFuelLogs] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isFuelFormOpen, setIsFuelFormOpen] = useState(false);
  const [isExpenseFormOpen, setIsExpenseFormOpen] = useState(false);

  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager') || hasRole('Dispatcher'); // Dispatcher can add fuel logs

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch summary every time to keep it fresh
      const summaryData = await getExpenseSummary();
      setSummary(summaryData.data || summaryData);

      if (activeTab === 'fuel') {
        const fuelData = await getFuelLogs();
        setFuelLogs(fuelData.data || []);
      } else {
        const expenseData = await getExpenses();
        setExpenses(expenseData.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteFuelLog = async (log) => {
    if (window.confirm('Are you sure you want to delete this fuel record?')) {
      try {
        await deleteFuelLog(log._id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete fuel log', error);
        alert(error.response?.data?.message || 'Failed to delete fuel log');
      }
    }
  };

  const handleDeleteExpense = async (expense) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await deleteExpense(expense._id);
        fetchData();
      } catch (error) {
        console.error('Failed to delete expense', error);
        alert(error.response?.data?.message || 'Failed to delete expense');
      }
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header-actions">
        <div>
          <h1>Fuel & Expenses</h1>
          <p>Track operational costs and fuel efficiency across the fleet.</p>
        </div>
        {canManage && (
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button
              onClick={() => setIsFuelFormOpen(true)}
              className="btn-secondary inline-flex"
            >
              <Droplets size={20} />
              Add Fuel Log
            </button>
            <button
              onClick={() => setIsExpenseFormOpen(true)}
              className="btn-primary inline-flex"
            >
              <Plus size={20} />
              Add Expense
            </button>
          </div>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <CostSummaryCard 
          title="Total Fuel Cost" 
          value={`₹${summary.fuelCost.toLocaleString()}`} 
          icon={<Droplets size={24} />} 
          subtitle={summary.averageFuelEfficiency > 0 ? `Avg ${summary.averageFuelEfficiency} km/L` : ''}
        />
        <CostSummaryCard 
          title="Maintenance Cost" 
          value={`₹${summary.maintenanceCost.toLocaleString()}`} 
          icon={<Wrench size={24} />} 
        />
        <CostSummaryCard 
          title="Other Expenses" 
          value={`₹${summary.otherExpenses.toLocaleString()}`} 
          icon={<FileText size={24} />} 
        />
        <CostSummaryCard 
          title="Operational Cost" 
          value={`₹${summary.operationalCost.toLocaleString()}`} 
          icon={<Activity size={24} />} 
          subtitle="Total recorded expenses"
        />
      </div>

      <div className="tabs-container" style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', gap: '2rem' }}>
        <button 
          className={`tab-button ${activeTab === 'fuel' ? 'active' : ''}`}
          onClick={() => setActiveTab('fuel')}
          style={{ padding: '0.75rem 0', background: 'none', border: 'none', color: activeTab === 'fuel' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, borderBottom: activeTab === 'fuel' ? '2px solid var(--brand-primary)' : '2px solid transparent', cursor: 'pointer', fontSize: '1rem' }}
        >
          Fuel Logs
        </button>
        <button 
          className={`tab-button ${activeTab === 'expenses' ? 'active' : ''}`}
          onClick={() => setActiveTab('expenses')}
          style={{ padding: '0.75rem 0', background: 'none', border: 'none', color: activeTab === 'expenses' ? 'var(--brand-primary)' : 'var(--text-secondary)', fontWeight: 600, borderBottom: activeTab === 'expenses' ? '2px solid var(--brand-primary)' : '2px solid transparent', cursor: 'pointer', fontSize: '1rem' }}
        >
          Other Expenses
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ width: '32px', height: '32px', border: '3px solid var(--border-color)', borderTopColor: 'var(--brand-primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <>
          {activeTab === 'fuel' && (
            <FuelTable fuelLogs={fuelLogs} onDelete={handleDeleteFuelLog} />
          )}
          {activeTab === 'expenses' && (
            <ExpenseTable expenses={expenses} onDelete={handleDeleteExpense} />
          )}
        </>
      )}

      {isFuelFormOpen && (
        <FuelForm 
          onClose={() => setIsFuelFormOpen(false)} 
          onComplete={fetchData} 
        />
      )}

      {isExpenseFormOpen && (
        <ExpenseForm 
          onClose={() => setIsExpenseFormOpen(false)} 
          onComplete={fetchData} 
        />
      )}
    </div>
  );
};

export default FuelExpenses;
