import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { apiRequest } from "../../utility/apiRequest";

// Async thunk for uploading video
export const uploadVideo = createAsyncThunk(
  "video/upload",
  async (formData, { rejectWithValue }) => {
    try {
      const response = await apiRequest("/video/upload", {
        method: "POST",
        body: formData, // FormData — apiRequest will skip Content-Type header
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.message);
    }
  }
);

const initialState = {
  isUploadModalOpen: false,
  uploading: false,
  uploadSuccess: false,
  uploadError: null,
  uploadedVideo: null,
};

const videoSlice = createSlice({
  name: "video",
  initialState,
  reducers: {
    openUploadModal: (state) => {
      state.isUploadModalOpen = true;
      state.uploadSuccess = false;
      state.uploadError = null;
      state.uploadedVideo = null;
    },
    closeUploadModal: (state) => {
      state.isUploadModalOpen = false;
      state.uploadSuccess = false;
      state.uploadError = null;
      state.uploadedVideo = null;
    },
    resetUploadState: (state) => {
      state.uploading = false;
      state.uploadSuccess = false;
      state.uploadError = null;
      state.uploadedVideo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadVideo.pending, (state) => {
        state.uploading = true;
        state.uploadError = null;
        state.uploadSuccess = false;
      })
      .addCase(uploadVideo.fulfilled, (state, action) => {
        state.uploading = false;
        state.uploadSuccess = true;
        state.uploadedVideo = action.payload;
      })
      .addCase(uploadVideo.rejected, (state, action) => {
        state.uploading = false;
        state.uploadError = action.payload;
      });
  },
});

export const { openUploadModal, closeUploadModal, resetUploadState } =
  videoSlice.actions;
export default videoSlice.reducer;
