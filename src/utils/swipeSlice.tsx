import { createSlice } from "@reduxjs/toolkit";

const swipeSlice = createSlice({
  name: "swipe",
  initialState: {
    swipes: [],
    matches: [],
    loading: false,
    error: null,
  },
  reducers: {
    setSwipes: (state, action) => {
      state.swipes = action.payload;
    },
    addSwipe: (state, action) => {
      state.swipes.push(action.payload);
    },
    setMatches: (state, action) => {
      state.matches = action.payload;
    },
    addMatch: (state, action) => {
      state.matches.push(action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setSwipes,
  addSwipe,
  setMatches,
  addMatch,
  setLoading,
  setError,
  clearError,
} = swipeSlice.actions;

export default swipeSlice.reducer;
