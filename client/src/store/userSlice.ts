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

const initialState: UserState = {
  email: undefined,
  id: undefined,
  loading: true,
};

export default createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: (): UserState => ({ ...initialState, loading: false }),
    set: (_, action: PayloadAction<UserDetails>): UserState => ({
      ...action.payload,
      loading: false,
    }),
  },
});
