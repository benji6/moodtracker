import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  React.useEffect(
    () =>
      void (async () => {
        try {
          const events = await storage.getEvents(undefined);
          if (events)
            dispatch({ type: "events/loadFromStorage", payload: events });
        } finally {
          dispatch({ type: "storage/loaded" });
        }
      })(),
    []
  );

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setEvents(undefined, state.events);
  }, [state.isStorageLoading, state.events]);
}
