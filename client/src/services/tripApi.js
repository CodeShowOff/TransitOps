import axios from 'axios';

const API_URL = 'http://localhost:5000/api/trips';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getTrips = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

export const createTrip = async (tripData) => {
  const response = await axios.post(API_URL, tripData, getAuthHeaders());
  return response.data;
};

export const dispatchTrip = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/dispatch`, {}, getAuthHeaders());
  return response.data;
};

export const completeTrip = async (id, completeData) => {
  const response = await axios.patch(`${API_URL}/${id}/complete`, completeData, getAuthHeaders());
  return response.data;
};

export const cancelTrip = async (id) => {
  const response = await axios.patch(`${API_URL}/${id}/cancel`, {}, getAuthHeaders());
  return response.data;
};

export const deleteTripDraft = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
