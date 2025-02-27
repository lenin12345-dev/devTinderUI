import { createSlice } from "@reduxjs/toolkit";

const storedUser = localStorage.getItem("user")

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser?JSON.parse(storedUser):null,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.user = action.payload;
      localStorage.setItem("user",JSON.stringify(state.user))
    },
  },
});
export const {loginRequest} = userSlice.actions
export default userSlice.reducer;
