import axios from 'axios';

const API_URL = 'http://localhost:5000/api/expenses';

const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: `Bearer ${token}`
    }
  };
};

export const getExpenseSummary = async () => {
  const response = await axios.get(`${API_URL}/summary`, getAuthHeaders());
  return response.data;
};

export const getExpenses = async (params = {}) => {
  const query = new URLSearchParams(params).toString();
  const response = await axios.get(`${API_URL}?${query}`, getAuthHeaders());
  return response.data;
};

export const createExpense = async (data) => {
  const response = await axios.post(API_URL, data, getAuthHeaders());
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`, getAuthHeaders());
  return response.data;
};
