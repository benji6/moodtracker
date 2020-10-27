import { combineReducers, configureStore } from "@reduxjs/toolkit";
import appSlice from "./appSlice";
import eventsSlice from "./eventsSlice";
import userSlice from "./userSlice";

const store = configureStore({
  reducer: combineReducers({
    app: appSlice.reducer,
    events: eventsSlice.reducer,
    user: userSlice.reducer,
  }),
});

export type RootState = ReturnType<typeof store.getState>;

export default store;
