import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./slices/loginSlice";

const store = configureStore({
  reducer: {
    login: loginReducer,
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
