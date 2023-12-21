import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings } from "../types";

interface SettingsState {
  data?: Settings;
}

const initialState: SettingsState = {};

export default createSlice({
  name: "settings",
  initialState,
  reducers: {
    clear: () => initialState,
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
  selectors: {
    data: (state) => state.data,
    recordLocation: (state) => Boolean(state.data?.recordLocation),
  },
});
