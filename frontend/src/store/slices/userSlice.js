import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utility/apiRequest";
import { restoreSession } from "./authSlice";

export const changePassword = createAsyncThunk(
  "user/changePassword",
  async (data, { rejectWithValue }) => {
    try {
      await apiRequest("/users/change_password", {
        method: "POST",
        body: JSON.stringify(data),
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "user/updateAvatar",
  async (avatarFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("avatar", avatarFile);

      const response = await apiRequest("/users/update_avatar", {
        method: "PATCH",
        body: formData,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCoverImage = createAsyncThunk(
  "user/updateCoverImage",
  async (coverFile, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("coverImage", coverFile);

      const response = await apiRequest("/users/update_coverImage", {
        method: "PATCH",
        body: formData,
      });

      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchUserChannel = createAsyncThunk(
  "user/fetchChannel",
  async (username, { rejectWithValue }) => {
    try {
      const response = await apiRequest(`/users/${username}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWatchHistory = createAsyncThunk(
  "user/fetchWatchHistory",
  async (_, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/users/watch_history");
      return response.data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    currentUser: null,
    watchHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearUserError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.currentUser = null;
      state.watchHistory = [];
    },
    updateUserData: (state, action) => {
      if (state.currentUser && action.payload) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentUser = action.payload;
        }
      })
      .addCase(restoreSession.rejected, (state) => {
        state.currentUser = null;
      })
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/pending"),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/fulfilled"),
        (state, action) => {
          state.loading = false;
          if (action.payload) {
            state.currentUser = action.payload;
          }
        }
      )
      .addMatcher(
        (action) =>
          action.type.startsWith("user/") && action.type.endsWith("/rejected"),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearUserError, clearUserData, updateUserData } =
  userSlice.actions;
export default userSlice.reducer;
