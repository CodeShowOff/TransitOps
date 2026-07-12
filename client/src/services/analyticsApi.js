import axios from 'axios';

const API_URL = 'http://localhost:5000/api/analytics';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getAnalyticsMetrics = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};

export const getChartData = async () => {
  const response = await axios.get(`${API_URL}/charts`, getAuthHeaders());
  return response.data;
};
