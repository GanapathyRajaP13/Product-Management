import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpirationTime: number;
  userData: object;
}

// initial state with specific type declared
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  refreshToken: null,
  userData: {},
  tokenExpirationTime: 30,
};

// login API using Thunk middleware
export const login = createAsyncThunk(
  "auth/login",
  async ({
    username,
    password,
    time,
  }: {
    username: string;
    password: string;
    time: number;
  }) => {
    const response = await apiClient.post("auth/login", {
      username,
      password,
      expiresInMins: time,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      // logout Operation clear all state
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.userData = {};
    },
    refreshTokens: (state, action) => {
      // new Token state refresh
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  // login thunk API pending need to load the screen
  extraReducers: (builder) => {
    builder.addCase(login.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    // login thunk API call success
    builder.addCase(login.fulfilled, (state, action) => {
      state.isAuthenticated = true;
      state.loading = false;
      state.token = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.userData = action.payload.userData
    });
    // login thunk API call rejucted
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message === "Request failed with status code 404"
          ? "No user found."
          : action.error.message === "Request failed with status code 401"
          ? "Invalid credentials"
          : "Failed to login";
    });
  },
});

export const { logout, refreshTokens } = authSlice.actions;

export default authSlice.reducer;
