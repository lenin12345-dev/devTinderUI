// utils/connectionSlice.js
import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connection: [],
    loading: false,
    error: null,
  },
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addConnection: (state, action) => {
      state.loading = false;
      state.connection = action.payload || [];
    },
    setConnectionError: (state, action) => {
      state.loading = false;
      state.error = action.payload || "Something went wrong.";
    },
    clearConnections: (state) => {
      state.connection = [];
      state.error = null;
      state.loading = false;
    },
  },
});

export const {
  startLoading,
  addConnection,
  setConnectionError,
  clearConnections,
} = connectionSlice.actions;

export default connectionSlice.reducer;
