// utils/store.ts
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
import connectionReducer from "./connectionSlice";
import requestReducer from "./requestSlice";
import swipeReducer from "./swipeSlice";

// 1️⃣ Configure the store
export const store = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    connection: connectionReducer,
    requests: requestReducer,
    swipe: swipeReducer,
  },
});

// 2️⃣ Infer RootState type from store
export type RootState = ReturnType<typeof store.getState>;
// - This gives you the complete state type of the Redux store
// - Useful for typed useSelector hooks

// 3️⃣ Infer AppDispatch type from store
export type AppDispatch = typeof store.dispatch;
// - This ensures dispatch knows all slice actions and thunks
// - Useful for typed useDispatch hooks
