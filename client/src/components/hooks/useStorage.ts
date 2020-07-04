import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  React.useEffect(() => {
    if (!state.userEmail) return;
    void (async () => {
      try {
        const events = await storage.getEvents();
        if (events)
          dispatch({ type: "events/loadFromStorage", payload: events });
      } finally {
        dispatch({ type: "storage/loaded" });
      }
    })();
  }, [state.userEmail]);

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setEvents(state.events);
  }, [state.isStorageLoading, state.events]);
}
