import { navigate } from "@reach/router";
import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";
import storage from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import {
  eventsSelector,
  userEmailSelector,
  userIdSelector,
  userLoadingSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";

export default function useStorage() {
  const appDispatch = React.useContext(DispatchContext);
  const dispatch = useDispatch();
  const state = React.useContext(StateContext);
  const events = useSelector(eventsSelector);
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
        if (!userId) return appDispatch({ type: "app/storageLoaded" });
        const events = await storage.getEvents(userId);
        if (events) dispatch(eventsSlice.actions.loadFromStorage(events));
      } finally {
        appDispatch({ type: "app/storageLoaded" });
      }
    })();
  }, [state.isStorageLoading, userId, userLoading]);

  // save events
  React.useEffect(() => {
    if (state.isStorageLoading || !userId) return;
    const { allIds, byId, hasLoadedFromServer, idsToSync, nextCursor } = events;
    storage.setEvents(userId, {
      allIds,
      byId,
      hasLoadedFromServer,
      idsToSync,
      nextCursor,
    });
  }, [state.isStorageLoading, userId, events]);
}
