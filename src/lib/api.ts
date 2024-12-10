import axios from 'axios';
import { NavigateFunction } from 'react-router-dom';
import { queryClient } from './queryClient';
import AuthService from '../services/AuthService';
import { QUERY_KEY } from './constants';
import { getToken } from './localStorageUtils';

export const baseURL = import.meta.env.VITE_API_URL;

export const api = axios.create({ baseURL, headers: { Authorization: `Bearer ${getToken()}` } });

export const setupResponseInterceptor = (navigate: NavigateFunction) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response.status === 401) {
        AuthService.signOut();
        queryClient.removeQueries({ queryKey: [QUERY_KEY.USER] });
        navigate('/login');
      }
      return Promise.reject(error);
    },
  );
};

export const fetcher = (url: string) => api.get(url).then((res) => res.data);
