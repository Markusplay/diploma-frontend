import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { queryClient } from './queryClient';
import { QUERY_KEY } from './constants';
import { getToken } from './localStorageUtils';

export const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL });

export const setupInterceptors = (navigate: NavigateFunction) => {
  api.interceptors.request.use(
    (config) => {
      const token = getToken();
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    },
  );

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        queryClient.removeQueries({ queryKey: [QUERY_KEY.USER] });
        navigate('/login');
      }
      return Promise.reject(error);
    },
  );
};
