import * as React from "react";
import { FluxStandardAction } from "../types";

type Action = FluxStandardAction<"app/storageLoaded">;

export interface State {
  isStorageLoading: boolean;
}

export const createInitialState = (): State => ({ isStorageLoading: true });

const initialState: State = createInitialState();

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {}
);
export const StateContext = React.createContext<State>(initialState);

export const appStateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "app/storageLoaded":
      return { ...state, isStorageLoading: false };
  }
};

export default function AppState({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(appStateReducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
