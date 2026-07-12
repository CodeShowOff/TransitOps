import React, { useState } from 'react';
import { completeMaintenance } from '../services/maintenanceApi';

const CompleteMaintenanceModal = ({ maintenanceId, onClose, onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    completedDate: new Date().toISOString().split('T')[0], // Default to today
    actualCost: '',
    remarks: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await completeMaintenance(maintenanceId, formData);
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to complete maintenance record');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none focus:outline-none bg-black bg-opacity-50 transition-opacity">
      <div className="relative w-full max-w-md mx-auto my-6">
        <div className="relative flex flex-col w-full bg-white border-0 rounded-lg shadow-xl outline-none focus:outline-none overflow-hidden">
          {/* Header */}
          <div className="flex items-start justify-between p-5 border-b border-solid rounded-t border-gray-200 bg-gray-50">
            <h3 className="text-xl font-semibold text-gray-800">
              Complete Maintenance
            </h3>
            <button
              className="p-1 ml-auto bg-transparent border-0 text-gray-500 float-right text-3xl leading-none font-semibold outline-none focus:outline-none hover:text-gray-800 transition-colors"
              onClick={onClose}
            >
              <span className="text-2xl block outline-none focus:outline-none">×</span>
            </button>
          </div>
          
          {/* Body */}
          <div className="relative p-6 flex-auto">
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-200 text-red-700 rounded text-sm">
                {error}
              </div>
            )}
            <p className="text-sm text-gray-600 mb-4">
              Completing this maintenance will change the vehicle status back to "Available".
            </p>
            <form onSubmit={handleSubmit} id="complete-maintenance-form" className="space-y-4">
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Completed Date *</label>
                <input
                  type="date"
                  name="completedDate"
                  value={formData.completedDate}
                  onChange={handleChange}
                  onClick={(e) => e.target.showPicker && e.target.showPicker()}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                  style={{ cursor: 'pointer' }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Actual Cost ($) *</label>
                <input
                  type="number"
                  name="actualCost"
                  value={formData.actualCost}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
                <textarea
                  name="remarks"
                  value={formData.remarks}
                  onChange={handleChange}
                  rows="2"
                  placeholder="Any final notes..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500 text-sm resize-none"
                ></textarea>
              </div>

            </form>
          </div>
          
          {/* Footer */}
          <div className="flex items-center justify-end p-4 border-t border-solid border-gray-200 bg-gray-50 rounded-b">
            <button
              className="text-gray-600 background-transparent font-medium px-6 py-2 text-sm outline-none focus:outline-none mr-2 mb-1 hover:bg-gray-100 rounded transition-colors"
              type="button"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              className="bg-green-600 text-white active:bg-green-700 font-medium text-sm px-6 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 transition-all disabled:opacity-50"
              type="submit"
              form="complete-maintenance-form"
              disabled={loading}
            >
              {loading ? 'Completing...' : 'Complete Maintenance'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompleteMaintenanceModal;
