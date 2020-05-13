import * as React from "react";
import { FluxStandardAction, NormalizedEvents, Mood, AppEvent } from "../types";

type Action =
  | FluxStandardAction<"events/add", AppEvent>
  | FluxStandardAction<"events/loadFromStorage", NormalizedEvents>
  | FluxStandardAction<"events/syncFromServer", AppEvent[]>
  | FluxStandardAction<"storage/loaded">
  | FluxStandardAction<"syncFromServer/error">
  | FluxStandardAction<"syncFromServer/start">
  | FluxStandardAction<"syncFromServer/success", string>
  | FluxStandardAction<"syncToServer/error">
  | FluxStandardAction<"syncToServer/start">
  | FluxStandardAction<"syncToServer/success">
  | FluxStandardAction<"user/clearEmail">
  | FluxStandardAction<"user/setEmail", string>;

interface NormalizedMoods {
  allIds: string[];
  byId: { [id: string]: Mood };
}

export interface State {
  events: NormalizedEvents;
  isStorageLoading: boolean;
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  moods: NormalizedMoods;
  syncFromServerError: boolean;
  syncToServerError: boolean;
  userEmail: string | undefined;
}

export const createInitialState = (): State => ({
  events: { allIds: [], byId: {}, idsToSync: [], nextCursor: undefined },
  isStorageLoading: true,
  isSyncingFromServer: false,
  isSyncingToServer: false,
  moods: { allIds: [], byId: {} },
  syncFromServerError: false,
  syncToServerError: false,
  userEmail: undefined,
});

const initialState: State = createInitialState();

export const DispatchContext = React.createContext<React.Dispatch<Action>>(
  () => {}
);
export const StateContext = React.createContext<State>(initialState);

const omit = <O, K extends keyof O>(object: O, key: K): Omit<O, K> => {
  const { [key]: _, ...rest } = object;
  return rest;
};

const getLastEvent = (normalizedState: NormalizedEvents): AppEvent => {
  if (!normalizedState.allIds.length)
    throw Error("Error: `allIds` must have length > 0");
  const lastId = normalizedState.allIds[normalizedState.allIds.length - 1];
  return normalizedState.byId[lastId];
};

const moodReducer = (
  moods: NormalizedMoods,
  event: AppEvent
): NormalizedMoods => {
  switch (event.type) {
    case "moods/create":
      return {
        allIds: [...moods.allIds, event.createdAt],
        byId: { ...moods.byId, [event.createdAt]: event.payload },
      };
    case "moods/delete":
      return {
        allIds: moods.allIds.filter((id) => id !== event.payload),
        byId: omit(moods.byId, event.payload),
      };
    case "moods/update":
      return {
        ...moods,
        byId: { ...moods.byId, [event.payload.id]: omit(event.payload, "id") },
      };
  }
};

const deriveMoodsFromEvents = (
  normalizedEvents: NormalizedEvents,
  moods: NormalizedMoods
): NormalizedMoods =>
  normalizedEvents.allIds
    .map((id) => normalizedEvents.byId[id])
    .reduce(moodReducer, moods);

export const appStateReducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "events/add": {
      let lastEvent = state.events.allIds.length
        ? getLastEvent(state.events)
        : undefined;
      if (lastEvent && lastEvent.createdAt > action.payload.createdAt) {
        const date = new Date(lastEvent.createdAt);
        date.setUTCMilliseconds(date.getUTCMilliseconds() + 1);
        const newCreatedAt = date.toISOString();
        action.payload.createdAt = newCreatedAt;
      }
      const allIds = [...state.events.allIds, action.payload.createdAt];
      const byId = {
        ...state.events.byId,
        [action.payload.createdAt]: action.payload,
      };
      const idsToSync = [...state.events.idsToSync, action.payload.createdAt];
      const events = { ...state.events, allIds, byId, idsToSync };
      if (!lastEvent || action.payload.createdAt > lastEvent.createdAt)
        return {
          ...state,
          events,
          moods: moodReducer(state.moods, action.payload),
        };
      events.allIds.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
      return {
        ...state,
        events,
        moods: deriveMoodsFromEvents(events, state.moods),
      };
    }
    case "events/loadFromStorage":
      return {
        ...state,
        events: action.payload,
        moods: deriveMoodsFromEvents(action.payload, state.moods),
      };
    case "events/syncFromServer": {
      if (!action.payload.length) return state;
      const byId = { ...state.events.byId };
      for (const event of action.payload) byId[event.createdAt] = event;
      const serverEventIds = action.payload.map((event) => event.createdAt);
      if (!state.events.allIds.length) {
        return {
          ...state,
          events: { ...state.events, allIds: serverEventIds, byId },
          moods: action.payload.reduce(moodReducer, state.moods),
        };
      }
      const lastClientEvent = getLastEvent(state.events);
      const lastServerEvent = action.payload[action.payload.length - 1];
      const allIds = [...new Set([...state.events.allIds, ...serverEventIds])];
      const events = { ...state.events, allIds, byId };
      if (lastServerEvent.createdAt > lastClientEvent.createdAt) {
        return {
          ...state,
          events,
          moods: action.payload.reduce(moodReducer, state.moods),
        };
      }
      events.allIds.sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
      return {
        ...state,
        events,
        moods: deriveMoodsFromEvents(events, { allIds: [], byId: {} }),
      };
    }
    case "storage/loaded":
      return { ...state, isStorageLoading: false };
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
        events: { ...state.events, idsToSync: [] },
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
        events: { ...state.events, nextCursor: action.payload },
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
  const [state, dispatch] = React.useReducer(appStateReducer, initialState);
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
}
