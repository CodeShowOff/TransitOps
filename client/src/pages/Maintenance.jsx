import React, { useState, useEffect, useCallback } from 'react';
import { getMaintenanceRecords, deleteMaintenance } from '../services/maintenanceApi';
import MaintenanceTable from '../components/MaintenanceTable';
import MaintenanceForm from '../components/MaintenanceForm';
import CompleteMaintenanceModal from '../components/CompleteMaintenanceModal';
import { Plus } from 'lucide-react';

const Maintenance = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [completingRecord, setCompletingRecord] = useState(null);

  // Pagination and Filtering State
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filterStatus, setFilterStatus] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecords = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page,
        limit: 10,
        ...(filterStatus && { status: filterStatus }),
        ...(searchQuery && { search: searchQuery }) // Search needs backend support, left here if added
      };
      const response = await getMaintenanceRecords(params);
      if (response && response.success) {
        setRecords(response.data);
        setTotalPages(response.pagination.pages);
      }
    } catch (err) {
      console.error('Failed to fetch maintenance records', err);
      setError('Failed to load maintenance records.');
    } finally {
      setLoading(false);
    }
  }, [page, filterStatus, searchQuery]);

  useEffect(() => {
    fetchRecords();
  }, [fetchRecords]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this maintenance record?')) {
      try {
        await deleteMaintenance(id);
        fetchRecords();
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to delete record');
      }
    }
  };

  const handleCompleteSuccess = () => {
    setCompletingRecord(null);
    fetchRecords();
  };

  const handleCreateSuccess = () => {
    setShowCreateModal(false);
    fetchRecords();
  };

  return (
    <div className="page-container" style={{ padding: '2rem' }}>
      <div className="page-header-actions">
        <div>
          <h1>Maintenance Management</h1>
          <p>Track and manage vehicle maintenance schedules.</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn-primary inline-flex"
          style={{ width: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <Plus size={18} />
          <span>Add Maintenance</span>
        </button>
      </div>

      <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="Search by vehicle..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="form-input"
          style={{ maxWidth: '300px' }}
        />
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="form-input"
          style={{ maxWidth: '200px' }}
        >
          <option value="">All Statuses</option>
          <option value="Active">Active</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
          Loading maintenance records...
        </div>
      ) : (
        <>
          <MaintenanceTable
            data={records}
            onComplete={(record) => setCompletingRecord(record)}
            onDelete={handleDelete}
          />
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
              <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                Page {page} of {totalPages}
              </span>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.5rem 1rem', opacity: page === 1 ? 0.5 : 1 }}
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="btn-primary"
                  style={{ width: 'auto', padding: '0.5rem 1rem', opacity: page === totalPages ? 0.5 : 1 }}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Modals */}
      {showCreateModal && (
        <MaintenanceForm
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
        />
      )}

      {completingRecord && (
        <CompleteMaintenanceModal
          isOpen={!!completingRecord}
          maintenanceId={completingRecord._id}
          onClose={() => setCompletingRecord(null)}
          onSuccess={handleCompleteSuccess}
        />
      )}
    </div>
  );
};

export default Maintenance;
