import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isStorageLoading: boolean;

  // When a user has just signed in we may want to show them
  // special information and hide it from users who have not
  // freshly signed in
  showNewSignInUi: boolean;
}

const initialState: AppState = {
  isStorageLoading: true,
  showNewSignInUi: false,
};

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    dismissNewSignInUi: (state) => {
      state.showNewSignInUi = false;
    },
    newSignIn: (state) => {
      state.isStorageLoading = true;
      state.showNewSignInUi = true;
    },
    storageLoaded: (state) => {
      state.isStorageLoading = false;
    },
  },
});
