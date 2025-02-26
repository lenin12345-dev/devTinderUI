import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.user = action.payload;
    },
  },
});
export const {loginRequest} = userSlice.actions
export default userSlice.reducer;
