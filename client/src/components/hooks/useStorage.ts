import * as React from "react";
import storage from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  settingsDataSelector,
  userEmailSelector,
  userIdSelector,
  userLoadingSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";
import appSlice from "../../store/appSlice";
import settingsSlice from "../../store/settingsSlice";
import { useNavigate } from "react-router-dom";

export default function useStorage() {
  const navigate = useNavigate();
  const events = useSelector(eventsSelector);
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const settingsData = useSelector(settingsDataSelector);
  const userEmail = useSelector(userEmailSelector);
  const userId = useSelector(userIdSelector);
  const userLoading = useSelector(userLoadingSelector);
  const dispatch = useDispatch();

  const lastUserId = React.useRef<string | undefined>();

  // handle user sign out
  if (lastUserId.current && !userId) {
    storage.deleteEvents(lastUserId.current);
    storage.deleteSettings(lastUserId.current);
    navigate("/");
  }

  lastUserId.current = userId;

  // save/clear user
  React.useEffect(() => {
    if (userLoading) return;
    if (!userEmail || !userId) storage.deleteUser();
    else storage.setUser({ email: userEmail, id: userId });
  }, [userEmail, userLoading, userId]);

  // load events & settings
  React.useEffect(() => {
    if (userLoading || !isStorageLoading) return;
    void (async () => {
      try {
        if (!userId) return dispatch(appSlice.actions.storageLoaded());
        const [events, settings] = await Promise.all([
          storage.getEvents(userId),
          storage.getSettings(userId),
        ]);
        if (events) dispatch(eventsSlice.actions.loadFromStorage(events));
        if (settings) dispatch(settingsSlice.actions.loadFromStorage(settings));
      } finally {
        dispatch(appSlice.actions.storageLoaded());
      }
    })();
  }, [dispatch, isStorageLoading, userId, userLoading]);

  // save events & settings
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
    if (settingsData) storage.setSettings(userId, settingsData);
  }, [isStorageLoading, settingsData, userId, events]);
}
