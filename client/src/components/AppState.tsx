import * as React from "react";
import { Mood } from "../types";

type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

type Action =
  | FluxStandardAction<"moods/add", Mood>
  | FluxStandardAction<"moods/set", Mood[]>
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface State {
  moods: Mood[];
  userEmail: string | undefined;
}

const initialState: State = { moods: [], userEmail: undefined };

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {}
);
export const StateContext = React.createContext<State>(initialState);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "moods/add":
      return { ...state, moods: [...state.moods, action.payload] };
    case "moods/set":
      return { ...state, moods: action.payload };
    case "user/clearEmail":
      return { ...state, userEmail: undefined };
    case "user/setEmail":
      return { ...state, userEmail: action.payload };
  }
};

export default function AppState({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = React.useReducer(reducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
