import React, { useEffect, useState } from 'react';
import { useDrivers } from '../hooks/useDrivers';
import DriverTable from '../components/DriverTable';
import DriverForm from '../components/DriverForm';

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
    <div className="page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>Drivers Management</h1>
        <button onClick={handleAddClick} style={{ padding: '8px 16px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          Add Driver
        </button>
      </div>

      {error && <div style={{ color: 'red', margin: '10px 0' }}>{error}</div>}

      <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
        <input 
          type="text" 
          placeholder="Search by name, ID or license..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: '8px' }}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} style={{ padding: '8px' }}>
          <option value="">All Statuses</option>
          <option value="Available">Available</option>
          <option value="On Trip">On Trip</option>
          <option value="Off Duty">Off Duty</option>
          <option value="Suspended">Suspended</option>
        </select>
        <button onClick={handleSearch} style={{ padding: '8px 16px' }}>Search</button>
      </div>

      {loading && !showForm ? (
        <p>Loading...</p>
      ) : showForm ? (
        <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '4px', backgroundColor: '#f9f9f9' }}>
          <h2>{editingDriver ? 'Edit Driver' : 'Add Driver'}</h2>
          <DriverForm 
            initialData={editingDriver} 
            onSubmit={handleFormSubmit} 
            onCancel={() => setShowForm(false)} 
          />
        </div>
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