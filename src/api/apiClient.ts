import axios, { AxiosInstance, AxiosResponse } from "axios";
import { store, RootState } from "../redux/store";
import { refreshAuthToken } from "./auth";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

apiClient.interceptors.request.use(
  async (config) => {
    const state: RootState = store.getState();
    const token = state.auth.token;
    const refreshToken = state.auth.refreshToken;

    if (refreshToken) {
      await refreshAuthToken(refreshToken, store.dispatch);
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

export type { AxiosResponse };
export default apiClient;
