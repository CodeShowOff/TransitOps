import axios from 'axios';

const API_URL = 'http://localhost:5000/api/vehicles';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getVehicles = async (params = {}) => {
  // params can include page, limit, search, type, status, region
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

export const getVehicleById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createVehicle = async (vehicleData) => {
  const response = await axios.post(API_URL, vehicleData, getAuthHeaders());
  return response.data;
};

export const updateVehicle = async (id, vehicleData) => {
  const response = await axios.put(`${API_URL}/${id}`, vehicleData, getAuthHeaders());
  return response.data;
};

export const deleteVehicle = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
