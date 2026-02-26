import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: [],
    loading: false,
    error: null,
    nextCursor: null,
    hasMore: true,
    matches: [],
  },
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
      state.loading = false;
      state.error = null;
    },
    addFeed: (state, action) => {
      state.feed = [...state.feed, ...action.payload];
      state.loading = false;
    },
    removeFeedUser: (state, action) => {
      state.feed = state.feed.filter((user) => user._id !== action.payload);
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setNextCursor: (state, action) => {
      state.nextCursor = action.payload;
    },
    setHasMore: (state, action) => {
      state.hasMore = action.payload;
    },
    addMatch: (state, action) => {
      state.matches.push(action.payload);
    },
  },
});

export const {
  setFeed,
  addFeed,
  removeFeedUser,
  setLoading,
  setError,
  incrementPage,
  setHasMore,
  addMatch,
} = feedSlice.actions;

export default feedSlice.reducer;
