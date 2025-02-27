import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
  name: "feed",
  initialState: {
    feed: [],
    loading: false,
    error: null,
  },
  reducers: {
    addFeed: (state, action) => {
        state.feed =  action.payload
    },
    removeFeedUser:(state,action)=>{
      state.feed  = state.feed.filter((each)=>each._id!==action.payload)
        // the return state inside removeFeedUser is unnecessary because Redux Toolkit uses Immer, which allows you to directly mutate the state. 
       
    
      
    }
  },
});

  export const {addFeed,removeFeedUser} = feedSlice.actions
export default feedSlice.reducer
