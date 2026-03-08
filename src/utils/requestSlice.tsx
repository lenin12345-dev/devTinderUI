// requestSlice.js
import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    loading: false,
    requests: [],
    error: null,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addRequests: (state, action) => {
      state.loading = false;
      state.requests = action.payload || [];
    },
    setError: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    },
    removeRequests: (state, action) => {
      state.requests = state.requests.filter(
        (request) => request._id !== action.payload
      );
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  startLoading,
  addRequests,
  setError,
  removeRequests,
  clearError,
} = requestSlice.actions;

export default requestSlice.reducer;
