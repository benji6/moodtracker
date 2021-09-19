import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import eventsSlice from "./eventsSlice";
import settingsSlice from "./settingsSlice";
import userSlice from "./userSlice";

export const slicesToClearOnLogout = [
  eventsSlice,
  settingsSlice,
  userSlice,
] as const;

const store = configureStore({
  reducer: combineReducers({
    app: appSlice.reducer,
    events: eventsSlice.reducer,
    settings: settingsSlice.reducer,
    user: userSlice.reducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
