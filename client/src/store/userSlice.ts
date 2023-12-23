import { PayloadAction, createSelector, createSlice } from "@reduxjs/toolkit";

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

const emailSelector = (state: UserState) => state.email;

export default createSlice({
  name: "user",
  initialState,
  reducers: {
    clear: (): UserState => ({ ...initialState, loading: false }),
    set: (_, action: PayloadAction<UserDetails>): UserState => ({
      ...action.payload,
      loading: false,
    }),
    setEmail: (state, action: PayloadAction<string>): UserState => ({
      ...state,
      email: action.payload,
    }),
  },
  selectors: {
    email: emailSelector,
    id: (state) => state.id,
    isSignedIn: createSelector(emailSelector, (email) => Boolean(email)),
    loading: (state) => state.loading,
  },
});
