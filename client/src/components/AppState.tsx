import * as React from "react";
import { Mood } from "../types";

type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

type Action =
  | FluxStandardAction<"createdMoodIds/set", string[]>
  | FluxStandardAction<"moods/add", Mood>
  | FluxStandardAction<"moods/set", Mood[]>
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface State {
  createdMoodsIds: string[];
  moods: Mood[];
  userEmail: string | undefined;
}

const initialState: State = {
  createdMoodsIds: [],
  moods: [],
  userEmail: undefined,
};

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {}
);
export const StateContext = React.createContext<State>(initialState);

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "createdMoodIds/set":
      return { ...state, createdMoodsIds: action.payload };
    case "moods/add":
      return {
        ...state,
        createdMoodsIds: [...state.createdMoodsIds, action.payload.createdAt],
        moods: [...state.moods, action.payload],
      };
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
