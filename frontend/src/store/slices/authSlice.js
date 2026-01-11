import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utility/apiRequest";

// Async thunk for login
export const login = createAsyncThunk(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/auth/login", {
        method: "POST",
        body: JSON.stringify(credentials),
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

// Async thunk for Google login
export const googleLogin = createAsyncThunk(
  "auth/googleLogin",
  async (token, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/auth/google-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      return response.data.user;
    } catch (err) {
      return rejectWithValue(err.message || "Google login failed");
    }
  }
);

// Async thunk for fetching current user
export const restoreSession = createAsyncThunk(
  "auth/fetchUser",
  async (__, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/auth/current_user");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message || "Not Aunthenticated");
    }
  }
);

// Async thunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch (error) {
      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

const initialState = {
  loading: false,
  isAuthenticated: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Google login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // current user
      .addCase(restoreSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(restoreSession.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = true;
      })
      .addCase(restoreSession.rejected, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.isAuthenticated = false;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
