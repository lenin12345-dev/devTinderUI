import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  feed: [],
  loading: false,
  error: null,
  hasMore: true,
  nextCursor: null,
};

const feedSlice = createSlice({
  name: "feed",
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },
    addFeed: (state, action) => {
      state.feed = [...state.feed, ...action.payload];
    },
    removeFeedUser: (state) => {
      state.feed.shift();
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    setNextCursor: (state, action) => {
      state.nextCursor = action.payload;
    },
    addMatch: (state, action) => {
      state.matches.push(action.payload);
    },
    resetFeed: () => initialState,
  },
});

export const {
  setFeed,
  addMatch,
  addFeed,
  removeFeedUser,
  setLoading,
  setError,
  setHasMore,
  setNextCursor,
  resetFeed,
} = feedSlice.actions;

export default feedSlice.reducer;
