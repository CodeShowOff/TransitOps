import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import VehicleTable from '../components/VehicleTable';
import VehicleForm from '../components/VehicleForm';
import { getVehicles, createVehicle, updateVehicle, deleteVehicle } from '../services/vehicleApi';
import { useAuth } from '../context/AuthContext';

const Fleet = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    status: '',
    region: ''
  });

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);

  const { hasRole } = useAuth();
  const canManage = hasRole('Fleet Manager');

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const data = await getVehicles(filters);
      setVehicles(data.data || []);
    } catch (error) {
      console.error('Failed to fetch vehicles', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, [filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleOpenForm = (vehicle = null) => {
    setEditingVehicle(vehicle);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingVehicle(null);
  };

  const handleFormSubmit = async (formData) => {
    try {
      if (editingVehicle) {
        await updateVehicle(editingVehicle._id, formData);
      } else {
        await createVehicle(formData);
      }
      handleCloseForm();
      fetchVehicles();
    } catch (error) {
      console.error('Failed to save vehicle', error);
      alert(error.response?.data?.message || 'Failed to save vehicle');
    }
  };

  const handleDelete = async (vehicle) => {
    if (window.confirm(`Are you sure you want to retire vehicle ${vehicle.registrationNumber}?`)) {
      try {
        await deleteVehicle(vehicle._id);
        fetchVehicles();
      } catch (error) {
        console.error('Failed to delete vehicle', error);
        alert(error.response?.data?.message || 'Failed to delete vehicle');
      }
    }
  };

  const handleView = (vehicle) => {
    if (canManage) {
      handleOpenForm(vehicle);
    } else {
      alert(`Viewing vehicle: ${vehicle.registrationNumber}`);
    }
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header-actions">
        <div>
          <h1>Fleet Management</h1>
          <p>Manage your vehicles and their statuses.</p>
        </div>
        {canManage && (
          <button
            onClick={() => handleOpenForm()}
            className="btn-primary inline-flex"
          >
            <Plus size={20} />
            Add Vehicle
          </button>
        )}
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', padding: '1.5rem' }}>
        <div className="filters-bar">
          <input
            type="text"
            name="search"
            placeholder="Search by Reg No. or Name"
            value={filters.search}
            onChange={handleFilterChange}
            className="form-input filter-input"
          />
          
          <select
            name="type"
            value={filters.type}
            onChange={handleFilterChange}
            className="form-input filter-input"
          >
            <option value="">All Types</option>
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
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
          <div style={{ 
            width: '32px', height: '32px', 
            border: '3px solid var(--border-color)', 
            borderTopColor: 'var(--brand-primary)', 
            borderRadius: '50%', 
            animation: 'spin 1s linear infinite' 
          }}></div>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : (
        <VehicleTable
          vehicles={vehicles}
          onView={handleView}
          onEdit={handleOpenForm}
          onDelete={handleDelete}
        />
      )}

      <VehicleForm
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        onSubmit={handleFormSubmit}
        initialData={editingVehicle}
      />
    </div>
  );
};

export default Fleet;
