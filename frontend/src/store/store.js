import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "./slices/sidebarSlice";
import authReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import videoReducer from "./slices/videoSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    auth: authReducer,
    user: userReducer,
    video: videoReducer,
  },
});
