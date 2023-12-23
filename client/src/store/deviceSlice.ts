import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { DeviceGeolocation } from "../types";

interface DeviceState {
  geolocation: DeviceGeolocation | undefined;
}

const initialState: DeviceState = { geolocation: undefined };

export default createSlice({
  name: "device",
  initialState,
  reducers: {
    clear: () => initialState,
    setGeolocation: (
      state: DeviceState,
      action: PayloadAction<DeviceGeolocation>,
    ) => {
      state.geolocation = action.payload;
    },
  },
  selectors: {
    geolocation: (state) => state.geolocation,
  },
});
