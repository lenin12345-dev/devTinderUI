// requestSlice.js
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface RequestState {
  loading: boolean;
  requests: any[];
  error: string | null;
}
const initialState: RequestState = {
  loading: false,
  requests: [],
  error: null,
};
const requestSlice = createSlice({
  name: "requests",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addRequests: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.requests = action.payload || [];
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong";
    },
    removeRequests: (state, action) => {
      state.requests = state.requests.filter(
        (request) => request._id !== action.payload,
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
