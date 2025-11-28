import { configureStore } from "@reduxjs/toolkit";
import postUiReducer from "./slices/postSlice";
const store = configureStore({
  reducer: {
    postUi: postUiReducer,
  },
});

export default store;
