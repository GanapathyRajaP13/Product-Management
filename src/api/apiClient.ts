/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { AxiosInstance, AxiosResponse } from "axios";
import { store, RootState } from "../redux/store";
import { refreshAuthToken } from "./auth";
import { jwtDecode } from "jwt-decode";

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

interface DecodedToken {
  exp: number;
  iat: number;
  [key: string]: any;
}

const isTokenExpired = (token: string): boolean => {
  try {
    const decoded: DecodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const state: RootState = store.getState();
    let token = state.auth.token;
    const refreshToken = state.auth.refreshToken;

    if (token && isTokenExpired(token)) {
      if (refreshToken) {
        await refreshAuthToken(refreshToken, store.dispatch);
        const newState: RootState = store.getState();
        token = newState.auth.token;
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export type { AxiosResponse };
export default apiClient;
