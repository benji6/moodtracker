import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { UserDetails } from "../types";

interface UserState {
  email: string | undefined;
  id: string | undefined;
  loading: boolean;
}

export default createSlice({
  name: "user",
  initialState: {
    email: undefined,
    id: undefined,
    loading: true,
  } as UserState,
  reducers: {
    clear: () => ({ email: undefined, id: undefined, loading: false }),
    set: (_, action: PayloadAction<UserDetails>) => ({
      ...action.payload,
      loading: false,
    }),
  },
});
