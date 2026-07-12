import React from 'react';
import { Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CategoryBadge = ({ category }) => {
  const getBadgeStyle = () => {
    switch (category) {
      case 'Maintenance': return { bg: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', border: '1px solid rgba(239, 68, 68, 0.2)' };
      case 'Toll': return { bg: 'rgba(59, 130, 246, 0.1)', color: 'var(--brand-primary)', border: '1px solid rgba(59, 130, 246, 0.2)' };
      case 'Repair': return { bg: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.2)' };
      case 'Parking': return { bg: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', border: '1px solid rgba(16, 185, 129, 0.2)' };
      default: return { bg: 'var(--glass-bg)', color: 'var(--text-secondary)', border: '1px solid var(--border-color)' };
    }
  };
  const style = getBadgeStyle();

  return (
    <span style={{ 
      display: 'inline-block', 
      padding: '0.25rem 0.75rem', 
      borderRadius: '20px', 
      fontSize: '0.75rem', 
      fontWeight: 600, 
      backgroundColor: style.bg, 
      color: style.color, 
      border: style.border 
    }}>
      {category}
    </span>
  );
};

const ExpenseTable = ({ expenses, onDelete }) => {
  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager');

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th>Vehicle</th>
            <th>Category</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Date</th>
            {canManage && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {expenses.map((expense) => (
            <tr key={expense._id}>
              <td style={{ fontWeight: 500, color: 'var(--text-primary)' }}>
                {expense.vehicle ? expense.vehicle.registrationNumber : 'N/A'}
              </td>
              <td><CategoryBadge category={expense.category} /></td>
              <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={expense.description}>
                {expense.description || '-'}
              </td>
              <td style={{ fontWeight: 600, color: 'var(--error)' }}>
                ₹{expense.amount.toLocaleString()}
              </td>
              <td>{new Date(expense.expenseDate).toLocaleDateString()}</td>
              {canManage && (
                <td>
                  <div className="action-buttons-cell">
                    <button
                      onClick={() => onDelete(expense)}
                      className="icon-btn delete"
                      title="Delete"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
          {expenses.length === 0 && (
            <tr>
              <td colSpan={canManage ? "6" : "5"} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No expenses found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ExpenseTable;
