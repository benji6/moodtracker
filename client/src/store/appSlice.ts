import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { EventTypeCategories } from "../types";

type EventTypeTracking = Record<EventTypeCategories, boolean>;

interface AppState {
  eventTypeTracking: EventTypeTracking;
  isStorageLoading: boolean;

  // When a user has just signed in we may want to show them
  // special information and hide it from users who have not
  // freshly signed in
  showNewSignInUi: boolean;
}

const initialState: AppState = {
  isStorageLoading: true,
  showNewSignInUi: false,
  eventTypeTracking: {
    "leg-raises": true,
    meditations: true,
    moods: true,
    "push-ups": true,
    runs: true,
    "sit-ups": true,
    sleeps: true,
    weights: true,
  },
} as const;

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    clear: () => initialState,
    dismissNewSignInUi: (state) => {
      state.showNewSignInUi = false;
    },
    loadFromStorage: (state, action: PayloadAction<EventTypeCategories[]>) => {
      const eventTypesSet = new Set(action.payload);
      for (const key of Object.keys(
        state.eventTypeTracking,
      ) as EventTypeCategories[])
        if (eventTypesSet.has(key)) state.eventTypeTracking[key] = false;
    },
    newSignIn: (state) => {
      state.isStorageLoading = true;
      state.showNewSignInUi = true;
    },
    toggleEventTrackingForEvent: (
      state,
      action: PayloadAction<EventTypeCategories>,
    ) => {
      state.eventTypeTracking[action.payload] =
        !state.eventTypeTracking[action.payload];
    },
    storageLoaded: (state) => {
      state.isStorageLoading = false;
    },
  },
  selectors: {
    eventTypeTracking: (state) => state.eventTypeTracking,
    isStorageLoading: (state) => state.isStorageLoading,
    showNewSignInUi: (state) => state.showNewSignInUi,
  },
});
