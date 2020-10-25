import { navigate } from "@reach/router";
import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import { useSelector } from "react-redux";
import {
  userEmailSelector,
  userIdSelector,
  userLoadingSelector,
} from "../../selectors";

export default function useStorage() {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  const userEmail = useSelector(userEmailSelector);
  const userId = useSelector(userIdSelector);
  const userLoading = useSelector(userLoadingSelector);
  const lastUserId = React.useRef<string | undefined>();

  // handle user sign out
  if (lastUserId.current && !userId) {
    storage.deleteEvents(lastUserId.current);
    navigate("/");
  }

  lastUserId.current = userId;

  // save user
  React.useEffect(() => {
    if (userLoading) return;
    if (!userEmail || !userId) storage.deleteUser();
    else storage.setUser({ email: userEmail, id: userId });
  }, [userEmail, userId]);

  // load events
  React.useEffect(() => {
    if (userLoading || !state.isStorageLoading) return;
    void (async () => {
      try {
        if (!userId) return dispatch({ type: "app/storageLoaded" });
        const events = await storage.getEvents(userId);
        if (events)
          dispatch({ type: "events/loadFromStorage", payload: events });
      } finally {
        dispatch({ type: "app/storageLoaded" });
      }
    })();
  }, [state.isStorageLoading, userId, userLoading]);

  // save events
  React.useEffect(() => {
    if (state.isStorageLoading || !userId) return;
    storage.setEvents(userId, state.events);
  }, [state.isStorageLoading, userId, state.events]);
}
