import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isStorageLoading: boolean;
}

export default createSlice({
  name: "app",
  initialState: {
    isStorageLoading: true,
  } as AppState,
  reducers: {
    storageLoaded: (state) => {
      state.isStorageLoading = false;
    },
  },
});
