import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface UserDetails {
  email: string;
  id: string;
}

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
    clear: (): UserState => ({
      email: undefined,
      id: undefined,
      loading: false,
    }),
    set: (_, action: PayloadAction<UserDetails>): UserState => ({
      ...action.payload,
      loading: false,
    }),
  },
});
