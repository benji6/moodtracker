import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: combineReducers({ user: userSlice.reducer }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
