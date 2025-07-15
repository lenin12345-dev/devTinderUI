import { createSlice } from "@reduxjs/toolkit";

// Get user from localStorage safely
let storedUser = null;
try {
  const userString = localStorage.getItem("user");
  if (userString && userString !== "undefined") {
    storedUser = JSON.parse(userString);
  }
} catch (e) {
  console.error("Error parsing stored user:", e);
  storedUser = null;
}

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: storedUser,
    loading: false,
    error: null,
  },
  reducers: {
    loginRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(state.user));
    },
  },
});

export const { loginRequest } = userSlice.actions;
export default userSlice.reducer;
