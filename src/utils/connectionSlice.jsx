import { createSlice } from "@reduxjs/toolkit";

const connectionSlice = createSlice({
  name: "connection",
  initialState: {
    connection: [],
    loading: false,
    error: null,
  },
  reducers: {
    addConnection: (state, action) => {
        state.connection =  action.payload
    },
  },
});

  export const {addConnection} = connectionSlice.actions
export default connectionSlice.reducer
