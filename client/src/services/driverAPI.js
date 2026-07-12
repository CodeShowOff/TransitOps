import axios from 'axios';

const API_URL = 'http://localhost:5000/api/drivers';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getDrivers = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

export const getDriverById = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};

export const createDriver = async (driverData) => {
  const response = await axios.post(API_URL, driverData, getAuthHeaders());
  return response.data;
};

export const updateDriver = async (id, driverData) => {
  const response = await axios.put(`${API_URL}/${id}`, driverData, getAuthHeaders());
  return response.data;
};

export const deleteDriver = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};