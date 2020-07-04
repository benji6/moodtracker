import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import useInterval from "./useInterval";
import { getEvents, postEvents } from "../../api";

export default function useEvents() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  const syncFromServer = (): void =>
    void (async (): Promise<void> => {
      if (
        !state.user.email ||
        state.isSyncingFromServer ||
        state.isStorageLoading
      )
        return;
      dispatch({ type: "syncFromServer/start" });
      try {
        const { events, nextCursor } = await getEvents(state.events.nextCursor);
        dispatch({ type: "events/syncFromServer", payload: events });
        dispatch({ type: "syncFromServer/success", payload: nextCursor });
      } catch {
        dispatch({ type: "syncFromServer/error" });
      }
    })();
  React.useEffect(syncFromServer, [state.isStorageLoading, state.user.email]);
  useInterval(syncFromServer, 6e4);

  const syncToServer = (): void =>
    void (async () => {
      if (
        !state.user.email ||
        state.isSyncingToServer ||
        state.isStorageLoading ||
        !state.events.idsToSync.length
      )
        return;
      dispatch({ type: "syncToServer/start" });
      try {
        await postEvents(
          state.events.idsToSync.map((id) => state.events.byId[id])
        );
        dispatch({ type: "syncToServer/success" });
      } catch {
        dispatch({ type: "syncToServer/error" });
      }
    })();
  React.useEffect(syncToServer, [
    state.events.idsToSync,
    state.isStorageLoading,
    state.user.email,
  ]);
  useInterval(syncToServer, 1e4);
}
