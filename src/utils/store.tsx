import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice.js";
import feedReducer from "./feedSlice.js";
import connectionReducer from "./connectionSlice.js";
import requestReducer from "./requestSlice.js";
import swipeReducer from "./swipeSlice.js";

export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    requests: requestReducer,
    swipe: swipeReducer,
  },
});
