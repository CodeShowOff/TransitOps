import axios from 'axios';

const API_URL = 'http://localhost:5000/api/dashboard';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getDashboardKPIs = async (filters = {}) => {
  // Build query string from non-empty filter values
  const params = new URLSearchParams();
  Object.entries(filters).forEach(([key, value]) => {
    if (value) params.append(key, value);
  });
  const queryString = params.toString();
  const url = queryString ? `${API_URL}?${queryString}` : API_URL;
  const response = await axios.get(url, getAuthHeaders());
  return response.data;
};
