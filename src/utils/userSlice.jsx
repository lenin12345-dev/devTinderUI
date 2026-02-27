import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    authSuccess: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
    authFailure: (state) => {
      state.user = null;
      state.loading = false;
    },
    logout: (state) => {
      state.user = null;
      state.loading = false;
    },
  },
});

export const { authStart, authSuccess, authFailure, logout } =
  userSlice.actions;
export default userSlice.reducer;
