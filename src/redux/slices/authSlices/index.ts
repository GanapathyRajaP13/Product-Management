import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  token: string | null;
  refreshToken: string | null;
}

// initial state with specific type declared
const initialState: AuthState = {
  isAuthenticated: false,
  loading: false,
  error: null,
  token: null,
  refreshToken: null,
};

// login API using Thunk middleware
export const login = createAsyncThunk(
  "auth/login",
  async ({ username, password }: { username: string; password: string }) => {
    const response = await axios.post("https://dummyjson.com/auth/login", {
      username,
      password,
      expiresInMins: 10,
    });
    return response.data;
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {       // logout Operation clear all state
      state.isAuthenticated = false;
      state.token = null;
      state.refreshToken = null;
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
      state.token = action.payload.token;
      state.refreshToken = action.payload.refreshToken;
    });
    // login thunk API call rejucted
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.error.message === "Request failed with status code 400"
          ? "Invalid credentials"
          : "Failed to login";
    });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
