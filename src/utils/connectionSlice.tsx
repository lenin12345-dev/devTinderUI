// utils/connectionSlice.js
import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
// PayloadAction<T> – explicitly tells Redux Toolkit what type the action carries. This prevents accidentally dispatching wrong data.

interface ConnectionState {
  connection: any[];
  loading: boolean;
  error: string | null;
}

const initialState: ConnectionState = {
  connection: [],
  loading: false,
  error: null,
};

const connectionSlice = createSlice({
  name: "connection",
  initialState,
  reducers: {
    startLoading: (state) => {
      state.loading = true;
      state.error = null;
    },
    addConnection: (state, action: PayloadAction<any[]>) => {
      state.loading = false;
      state.connection = action.payload || [];
      state.error = null;
    },
    setConnectionError: (state, action: PayloadAction<string>) => {
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
