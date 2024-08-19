import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { store, RootState } from '../redux/store';
import { refreshAuthToken } from './auth';

const apiClient: AxiosInstance = axios.create({
  baseURL: 'https://dummyjson.com/', // Replace with your actual API base URL
});

// Optionally, configure interceptors here if necessary
apiClient.interceptors.request.use(
  async (config) => {
    const state: RootState = store.getState();
    const token = state.auth.token;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      await refreshAuthToken(refreshToken, store.dispatch); // Pass dispatch from the store
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export type { AxiosResponse }; // Export AxiosResponse type for use in components
export default apiClient;
