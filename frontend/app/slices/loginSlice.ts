import { createSlice } from "@reduxjs/toolkit";

export const loginSlice = createSlice({
  name: "login",
  initialState: {
    isLogged: false,
  },
  reducers: {
    login: (state: any) => {
      state.isLogged = true;
    },
    logout: (state: any) => {
      state.isLogged = false;
    },
  },
});

export const { login, logout } = loginSlice.actions;

export default loginSlice.reducer;
