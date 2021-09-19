import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Settings } from "../types";

interface SettingsState {
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  data?: Settings;
  shouldSyncToServer: boolean;
}

export const createInitialState = (): SettingsState => ({
  isSyncingFromServer: false,
  isSyncingToServer: false,
  shouldSyncToServer: false,
});

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
      state.shouldSyncToServer = true;
    },
    syncFromServerStart: (state) => {
      state.isSyncingFromServer = true;
    },
    syncFromServerError: (state) => {
      state.isSyncingFromServer = false;
    },
    syncFromServerSuccess: (
      state,
      action: PayloadAction<Settings | undefined>
    ) => {
      state.isSyncingFromServer = false;

      if (!action.payload) {
        if (state.data) state.shouldSyncToServer = true;
        return;
      }

      if (!state.data) {
        state.data = action.payload;
        return;
      }

      if (state.data.updatedAt > action.payload.updatedAt) {
        state.shouldSyncToServer = true;
        return;
      }

      state.data = action.payload;
    },
    syncToServerStart: (state) => {
      state.isSyncingToServer = true;
    },
    syncToServerError: (state) => {
      state.isSyncingToServer = false;
    },
    syncToServerSuccess: (state) => {
      state.isSyncingToServer = false;
      state.shouldSyncToServer = false;
    },
  },
});
