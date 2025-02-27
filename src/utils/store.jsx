import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../utils/userSlice";
import feedReducer from "../utils/feedSlice";
import connectionReducer from "../utils/connectionSlice";
import requestReducer from "../utils/requestSlice";





export const store = configureStore({
    reducer:{
        user:userReducer,
        feed:feedReducer,
        connection:connectionReducer,
        requests:requestReducer
    }
})