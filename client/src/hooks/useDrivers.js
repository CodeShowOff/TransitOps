import { useState, useCallback } from 'react';
import * as driverApi from '../services/driverApi';

export const useDrivers = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchDrivers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await driverApi.getDrivers(params);
      setDrivers(data.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addDriver = async (driverData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await driverApi.createDriver(driverData);
      setDrivers(prev => [data.data, ...prev]);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const editDriver = async (id, driverData) => {
    setLoading(true);
    setError(null);
    try {
      const data = await driverApi.updateDriver(id, driverData);
      setDrivers(prev => prev.map(d => d._id === id ? data.data : d));
      return data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeDriver = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await driverApi.deleteDriver(id);
      setDrivers(prev => prev.filter(d => d._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    drivers,
    loading,
    error,
    fetchDrivers,
    addDriver,
    editDriver,
    removeDriver
  };
};