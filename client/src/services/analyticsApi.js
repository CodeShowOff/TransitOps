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

export const getAnalyticsMetrics = async (filters = {}) => {
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};

export const getChartData = async () => {
  const response = await axios.get(`${API_URL}/charts`, getAuthHeaders());
  return response.data;
};
