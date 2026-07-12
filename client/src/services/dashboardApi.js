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

export const getDashboardKPIs = async () => {
  const response = await axios.get(API_URL, getAuthHeaders());
  return response.data;
};
