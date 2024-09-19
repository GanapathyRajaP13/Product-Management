import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import apiClient from "../../api/apiClient";

export interface UserData {
  username: string;
  email: string;
  firstname: string;
  lastname: string;
  gender: string;
  userCode: string;
  isActive: number;
  UserType: number;
  id: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
  tokenExpirationTime: number;
  userData: UserData;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  refreshToken: null,
  tokenExpirationTime: 30,
  userData: {
    username: "",
    email: "",
    firstname: "",
    lastname: "",
    gender: "",
    userCode: "",
    isActive: 0,
    UserType: 2,
    id: "",
  },
};

export const login = createAsyncThunk(
  "auth/login",
  async ({
    username,
    password,
    role,
    time,
  }: {
    username: string;
    password: string;
    role: string;
    time: number;
  }) => {
    const response = await apiClient.post("auth/login", {
      username,
      password,
      role,
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
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
      state.error = null;
      state.userData = {
        username: "",
        email: "",
        firstname: "",
        lastname: "",
        gender: "",
        userCode: "",
        isActive: 0,
        UserType: 2,
        id: "",
      };
    },
    refreshTokens: (state, action) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.loading = false;
        state.token = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.userData = action.payload.userData;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message === "Request failed with status code 404"
            ? "No user found."
            : action.error.message === "Request failed with status code 401"
            ? "Password Incorrect"
            : "Failed to login";
      });
  },
});

export const { logout, refreshTokens } = authSlice.actions;

export default authSlice.reducer;
