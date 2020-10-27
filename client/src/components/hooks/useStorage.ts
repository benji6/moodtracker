import { navigate } from "@reach/router";
import * as React from "react";
import storage from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  userEmailSelector,
  userIdSelector,
  userLoadingSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";
import appSlice from "../../store/appSlice";

export default function useStorage() {
  const events = useSelector(eventsSelector);
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const userEmail = useSelector(userEmailSelector);
  const userId = useSelector(userIdSelector);
  const userLoading = useSelector(userLoadingSelector);
  const dispatch = useDispatch();

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
    if (userLoading || !isStorageLoading) return;
    void (async () => {
      try {
        if (!userId) return dispatch(appSlice.actions.storageLoaded());
        const events = await storage.getEvents(userId);
        if (events) dispatch(eventsSlice.actions.loadFromStorage(events));
      } finally {
        dispatch(appSlice.actions.storageLoaded());
      }
    })();
  }, [isStorageLoading, userId, userLoading]);

  // save events
  React.useEffect(() => {
    if (isStorageLoading || !userId) return;
    const { allIds, byId, hasLoadedFromServer, idsToSync, nextCursor } = events;
    storage.setEvents(userId, {
      allIds,
      byId,
      hasLoadedFromServer,
      idsToSync,
      nextCursor,
    });
  }, [isStorageLoading, userId, events]);
}
