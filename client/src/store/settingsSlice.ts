import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings } from "../types";

interface SettingsState {
  data?: Settings;
}

export const createInitialState = (): SettingsState => ({});

export default createSlice({
  name: "settings",
  initialState: createInitialState(),
  reducers: {
    clear: createInitialState,
    loadFromStorage(state, action: PayloadAction<Settings>) {
      state.data = action.payload;
    },
    setLocationRecording: (state, action: PayloadAction<boolean>) => {
      state.data = {
        recordLocation: action.payload,
        updatedAt: new Date().toISOString(),
      };
    },
  },
});
