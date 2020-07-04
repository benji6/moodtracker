import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  React.useEffect(() => {
    if (state.user.loading || !state.isStorageLoading) return;
    if (!state.user.email) return dispatch({ type: "storage/loaded" });
    void (async () => {
      try {
        const events = await storage.getEvents();
        if (events)
          dispatch({ type: "events/loadFromStorage", payload: events });
      } finally {
        dispatch({ type: "storage/loaded" });
      }
    })();
  }, [state.isStorageLoading, state.user.email, state.user.loading]);

  React.useEffect(() => {
    if (state.isStorageLoading) return;
    storage.setEvents(state.events);
  }, [state.isStorageLoading, state.events]);
}
