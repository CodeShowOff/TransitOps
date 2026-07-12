import axios from 'axios';

const API_URL = 'http://localhost:5000/api/maintenance';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getMaintenanceRecords = async (params) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

export const getMaintenanceById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createMaintenance = async (maintenanceData) => {
  const response = await axios.post(API_URL, maintenanceData, getAuthHeaders());
  return response.data;
};

export const completeMaintenance = async (id, completionData) => {
  const response = await axios.patch(`${API_URL}/${id}/complete`, completionData, getAuthHeaders());
  return response.data;
};

export const deleteMaintenance = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
