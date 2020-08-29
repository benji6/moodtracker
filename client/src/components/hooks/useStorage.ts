import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);

  // save user
  React.useEffect(() => {
    if (state.user.loading) return;
    const { email, id } = state.user;
    if (!email || !id) storage.deleteUser();
    else storage.setUser({ email, id });
  }, [state.user]);

  // load events
  React.useEffect(() => {
    if (state.user.loading || !state.isStorageLoading) return;
    void (async () => {
      try {
        if (!state.user.id) return dispatch({ type: "app/storageLoaded" });
        const events = await storage.getEvents(state.user.id);
        if (events)
          dispatch({ type: "events/loadFromStorage", payload: events });
      } finally {
        dispatch({ type: "app/storageLoaded" });
      }
    })();
  }, [state.isStorageLoading, state.user.id, state.user.loading]);

  // save events
  React.useEffect(() => {
    if (state.isStorageLoading || !state.user.id) return;
    storage.setEvents(state.user.id, state.events);
  }, [state.isStorageLoading, state.user.id, state.events]);
}
