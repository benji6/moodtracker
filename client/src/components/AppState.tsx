import * as React from "react";
import { Mood, NormalizedMoods } from "../types";

type FluxStandardAction<
  Type extends string,
  Payload = undefined
> = Payload extends undefined
  ? { type: Type }
  : { payload: Payload; type: Type };

type Action =
  | FluxStandardAction<"createdMoodIds/set", string[]>
  | FluxStandardAction<"deletedMoodIds/set", string[]>
  | FluxStandardAction<"moods/create", Mood>
  | FluxStandardAction<"moods/delete", string>
  | FluxStandardAction<"moods/set", NormalizedMoods>
  | FluxStandardAction<"syncFromServer/error">
  | FluxStandardAction<"syncFromServer/start">
  | FluxStandardAction<"syncFromServer/success">
  | FluxStandardAction<"syncToServer/error">
  | FluxStandardAction<"syncToServer/start">
  | FluxStandardAction<
      "syncToServer/success",
      { createdIds: string[]; deletedIds: string[] }
    >
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface State {
  createdMoodsIds: string[];
  deletedMoodsIds: string[];
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  moods: NormalizedMoods;
  syncFromServerError: boolean;
  syncToServerError: boolean;
  userEmail: string | undefined;
}

const initialState: State = {
  createdMoodsIds: [],
  deletedMoodsIds: [],
  isSyncingFromServer: false,
  isSyncingToServer: false,
  moods: { allIds: [], byId: {} },
  syncFromServerError: false,
  syncToServerError: false,
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
    case "deletedMoodIds/set":
      return { ...state, deletedMoodsIds: action.payload };
    case "moods/create":
      return {
        ...state,
        createdMoodsIds: [...state.createdMoodsIds, action.payload.createdAt],
        moods: {
          allIds: [...state.moods.allIds, action.payload.createdAt],
          byId: {
            ...state.moods.byId,
            [action.payload.createdAt]: action.payload,
          },
        },
      };
    case "moods/delete": {
      const { [action.payload]: _, ...newById } = state.moods.byId;
      return {
        ...state,
        createdMoodsIds: state.createdMoodsIds.filter(
          (id) => id !== action.payload
        ),
        deletedMoodsIds: [...state.deletedMoodsIds, action.payload],
        moods: {
          allIds: state.moods.allIds.filter((id) => id !== action.payload),
          byId: newById,
        },
      };
    }
    case "moods/set":
      return { ...state, moods: action.payload };
    case "syncToServer/error":
      return {
        ...state,
        isSyncingToServer: false,
        syncToServerError: true,
      };
    case "syncToServer/start":
      return {
        ...state,
        isSyncingToServer: true,
        syncToServerError: false,
      };
    case "syncToServer/success":
      return {
        ...state,
        createdMoodsIds: action.payload.createdIds.length
          ? state.createdMoodsIds.filter(
              (id) => !action.payload.createdIds.includes(id)
            )
          : state.createdMoodsIds,
        deletedMoodsIds: action.payload.deletedIds.length
          ? state.deletedMoodsIds.filter(
              (id) => !action.payload.deletedIds.includes(id)
            )
          : state.deletedMoodsIds,
        isSyncingToServer: false,
        syncToServerError: false,
      };
    case "syncFromServer/error":
      return {
        ...state,
        isSyncingFromServer: false,
        syncFromServerError: true,
      };
    case "syncFromServer/start":
      return {
        ...state,
        isSyncingFromServer: true,
        syncFromServerError: false,
      };
    case "syncFromServer/success":
      return {
        ...state,
        isSyncingFromServer: false,
        syncFromServerError: false,
      };
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
