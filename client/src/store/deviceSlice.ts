import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DeviceGeolocation } from "../types";

interface DeviceState {
  geolocation: DeviceGeolocation | undefined;
}

export const createInitialState = (): DeviceState => ({
  geolocation: undefined,
});

export default createSlice({
  name: "device",
  initialState: createInitialState(),
  reducers: {
    clear: createInitialState,
    setGeolocation: (
      state: DeviceState,
      action: PayloadAction<DeviceGeolocation>
    ) => {
      state.geolocation = action.payload;
    },
  },
});
