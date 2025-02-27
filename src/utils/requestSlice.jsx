import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
    name:"request",
    initialState:{
        loading:false,
        requests:[],
        error:null
    },
    reducers:{
        addRequests:(state,action)=>{
            state.requests = action.payload
        },
        removeRequests:(state,action)=>{
            state.requests = state.requests.filter(request => request._id !== action.payload)
        }
    }
})

export const {addRequests,removeRequests} = requestSlice.actions
export default requestSlice.reducer