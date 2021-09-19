import { createSlice } from "@reduxjs/toolkit";

interface AppState {
  isStorageLoading: boolean;
}

const initialState: AppState = {
  isStorageLoading: true,
};

export default createSlice({
  name: "app",
  initialState,
  reducers: {
    storageLoaded: (state) => {
      state.isStorageLoading = false;
    },
  },
});
