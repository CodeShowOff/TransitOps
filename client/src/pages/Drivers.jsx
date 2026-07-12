import React, { useEffect, useState } from 'react';
import { useDrivers } from '../hooks/useDrivers';
import DriverTable from '../components/DriverTable';
import DriverForm from '../components/DriverForm';
import { Plus, Search, Filter } from 'lucide-react';

const Drivers = () => {
  const { drivers, loading, error, fetchDrivers, addDriver, editDriver, removeDriver } = useDrivers();
  const [showForm, setShowForm] = useState(false);
  const [editingDriver, setEditingDriver] = useState(null);
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    fetchDrivers();
  }, [fetchDrivers]);

  const handleSearch = () => {
    fetchDrivers({ search: searchTerm, status: statusFilter });
  };

  const handleAddClick = () => {
    setEditingDriver(null);
    setShowForm(true);
  };

  const handleEditClick = (driver) => {
    setEditingDriver(driver);
    setShowForm(true);
  };

  const handleDeleteClick = async (driver) => {
    if (window.confirm(`Are you sure you want to delete driver ${driver.name}?`)) {
      await removeDriver(driver._id);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingDriver) {
        await editDriver(editingDriver._id, formData);
      } else {
        await addDriver(formData);
      }
      setShowForm(false);
    } catch (err) {
      console.error('Submit error:', err);
      alert('Error saving driver: ' + err.message);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header-actions">
        <div>
          <h1 style={{ background: 'var(--brand-gradient)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Drivers Management
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Manage your fleet personnel and track safety scores.
          </p>
        </div>
        <button
          onClick={handleAddClick}
          className="ai-btn-primary"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.75rem 1.5rem' }}
        >
          <Plus size={20} />
          Add Driver
        </button>
      </div>

      {error && (
        <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', borderRadius: '12px', color: 'var(--error)', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div className="filters-bar" style={{ margin: 0 }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Search size={18} />
            </div>
            <input 
              type="text" 
              placeholder="Search by name, ID or license..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="form-input filter-input"
              style={{ paddingLeft: '2.5rem' }}
            />
          </div>
          
          <div style={{ position: 'relative', minWidth: '200px' }}>
            <div style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              <Filter size={18} />
            </div>
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)} 
              className="form-input filter-input"
              style={{ paddingLeft: '2.5rem' }}
            >
              <option value="">All Statuses</option>
              <option value="Available">Available</option>
              <option value="On Trip">On Trip</option>
              <option value="Off Duty">Off Duty</option>
              <option value="Suspended">Suspended</option>
            </select>
          </div>
          
          <button 
            onClick={handleSearch} 
            className="ai-btn-secondary"
            style={{ padding: '0.875rem 2rem' }}
          >
            Search
          </button>
        </div>
      </div>

      {loading && !showForm ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            border: '3px solid var(--border-color)', 
            borderTopColor: 'var(--brand-primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
        </div>
      ) : showForm ? (
        <DriverForm 
          initialData={editingDriver} 
          onSubmit={handleFormSubmit} 
          onCancel={() => setShowForm(false)} 
        />
      ) : (
        <DriverTable 
          drivers={drivers} 
          onEdit={handleEditClick} 
          onDelete={handleDeleteClick} 
        />
      )}
    </div>
  );
};

export default Drivers;