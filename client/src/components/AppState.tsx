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
  | FluxStandardAction<"deletedMoodIds/set", string[]>
  | FluxStandardAction<"moods/create", Mood>
  | FluxStandardAction<"moods/delete", string>
  | FluxStandardAction<"moods/set", Mood[]>
  | FluxStandardAction<"syncFromServer/error">
  | FluxStandardAction<"syncFromServer/start">
  | FluxStandardAction<"syncFromServer/success">
  | FluxStandardAction<"syncCreatedToServer/error">
  | FluxStandardAction<"syncCreatedToServer/start">
  | FluxStandardAction<"syncCreatedToServer/success">
  | FluxStandardAction<"syncDeletedToServer/error">
  | FluxStandardAction<"syncDeletedToServer/start">
  | FluxStandardAction<"syncDeletedToServer/success">
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface State {
  createdMoodsIds: string[];
  deletedMoodsIds: string[];
  isSyncingFromServer: boolean;
  isSyncingCreatedToServer: boolean;
  isSyncingDeletedToServer: boolean;
  moods: Mood[];
  syncFromServerError: boolean;
  syncCreatedToServerError: boolean;
  syncDeletedToServerError: boolean;
  userEmail: string | undefined;
}

const initialState: State = {
  createdMoodsIds: [],
  deletedMoodsIds: [],
  isSyncingFromServer: false,
  isSyncingCreatedToServer: false,
  isSyncingDeletedToServer: false,
  moods: [],
  syncFromServerError: false,
  syncCreatedToServerError: false,
  syncDeletedToServerError: false,
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
        moods: [...state.moods, action.payload],
      };
    case "moods/delete":
      return {
        ...state,
        createdMoodsIds: state.createdMoodsIds.filter(
          (id) => id !== action.payload
        ),
        deletedMoodsIds: [...state.deletedMoodsIds, action.payload],
        moods: state.moods.filter((mood) => mood.createdAt !== action.payload),
      };
    case "moods/set":
      return { ...state, moods: action.payload };
    case "syncCreatedToServer/error":
      return {
        ...state,
        isSyncingCreatedToServer: false,
        syncCreatedToServerError: true,
      };
    case "syncCreatedToServer/start":
      return {
        ...state,
        isSyncingCreatedToServer: true,
        syncCreatedToServerError: false,
      };
    case "syncCreatedToServer/success":
      return {
        ...state,
        createdMoodsIds: [],
        isSyncingCreatedToServer: false,
        syncCreatedToServerError: false,
      };
    case "syncDeletedToServer/error":
      return {
        ...state,
        isSyncingDeletedToServer: false,
        syncDeletedToServerError: true,
      };
    case "syncDeletedToServer/start":
      return {
        ...state,
        isSyncingDeletedToServer: true,
        syncDeletedToServerError: false,
      };
    case "syncDeletedToServer/success":
      return {
        ...state,
        deletedMoodsIds: [],
        isSyncingDeletedToServer: false,
        syncDeletedToServerError: false,
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
