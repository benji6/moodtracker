import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppEvent } from "../types";

interface EventsState {
  allIds: string[];
  byId: { [id: string]: AppEvent };

  // Is false until initial load from server succeeds or errors.
  // This allows us to display a loading spinner when switching users.
  hasLoadedFromServer: boolean;
  idsToSync: string[];
  isSyncingFromServer: boolean;
  isSyncingToServer: boolean;
  nextCursor: string | undefined;
  syncFromServerError: boolean;
  syncToServerError: boolean;
}

export type EventsStateToStore = Omit<
  EventsState,
  | "isSyncingFromServer"
  | "isSyncingToServer"
  | "syncFromServerError"
  | "syncToServerError"
>;

const getLastEvent = (normalizedState: EventsState): AppEvent => {
  if (!normalizedState.allIds.length)
    throw Error("Error: `allIds` must have length > 0");
  const lastId = normalizedState.allIds.at(-1)!;
  return normalizedState.byId[lastId];
};

export const createInitialState = (): EventsState => ({
  allIds: [],
  byId: {},
  hasLoadedFromServer: false,
  idsToSync: [],
  isSyncingFromServer: false,
  isSyncingToServer: false,
  syncFromServerError: false,
  syncToServerError: false,
  nextCursor: undefined,
});

export default createSlice({
  name: "events",
  initialState: createInitialState(),
  reducers: {
    add: (state, action: PayloadAction<AppEvent>) => {
      const lastEvent = state.allIds.length ? getLastEvent(state) : undefined;
      if (lastEvent && lastEvent.createdAt > action.payload.createdAt) {
        const date = new Date(lastEvent.createdAt);
        date.setUTCMilliseconds(date.getUTCMilliseconds() + 1);
        const newCreatedAt = date.toISOString();
        action.payload.createdAt = newCreatedAt;
      }
      state.allIds.push(action.payload.createdAt);
      state.byId[action.payload.createdAt] = action.payload;
      state.idsToSync.push(action.payload.createdAt);
    },
    clear: createInitialState,
    loadFromStorage: (state, action: PayloadAction<EventsStateToStore>) =>
      Object.assign(state, action.payload),
    syncToServerStart: (state) => {
      state.isSyncingToServer = true;
      state.syncToServerError = false;
    },
    syncToServerError: (state) => {
      state.isSyncingToServer = false;
      state.syncToServerError = true;
    },
    syncToServerSuccess: (state) => {
      state.idsToSync = [];
      state.isSyncingToServer = false;
      state.syncToServerError = false;
    },
    syncFromServerStart: (state) => {
      state.isSyncingFromServer = true;
      state.syncFromServerError = false;
    },
    syncFromServerError: (state) => {
      state.isSyncingFromServer = false;
      state.syncFromServerError = true;
    },
    syncFromServerSuccess: (
      state,
      action: PayloadAction<{ cursor: string; events: AppEvent[] }>
    ) => {
      state.isSyncingFromServer = false;
      state.syncFromServerError = false;
      state.hasLoadedFromServer = true;
      state.nextCursor = action.payload.cursor;
      if (!action.payload.events.length) return;
      for (const event of action.payload.events)
        state.byId[event.createdAt] = event;
      const serverEventIds = action.payload.events.map(
        (event) => event.createdAt
      );
      state.allIds = (
        state.allIds.length
          ? [...new Set([...state.allIds, ...serverEventIds])]
          : serverEventIds
      )
        // The API offers no order guarantees
        .sort((a, b) => (a > b ? 1 : a < b ? -1 : 0));
    },
  },
});
