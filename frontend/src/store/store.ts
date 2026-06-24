import { configureStore } from "@reduxjs/toolkit";
import authSliceReducer from "./authSlice";
import activateSliceReducer from "./activateSlice";

const store = configureStore({
  reducer: {
    authSlice: authSliceReducer,
    activateSlice: activateSliceReducer,
  },
});

export default store;
