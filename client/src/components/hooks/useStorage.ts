import * as React from "react";
import storage from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  eventsAllIdsSelector,
  eventsByIdSelector,
  eventsHasLoadedFromServerSelector,
  eventsIdsToSyncSelector,
  eventsNextCursorSelector,
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
  const eventsAllIds = useSelector(eventsAllIdsSelector);
  const eventsById = useSelector(eventsByIdSelector);
  const eventsHasLoadedFromServer = useSelector(
    eventsHasLoadedFromServerSelector,
  );
  const eventsIdsToSync = useSelector(eventsIdsToSyncSelector);
  const eventsNextCursor = useSelector(eventsNextCursorSelector);
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
    storage.setEvents(userId, {
      allIds: eventsAllIds,
      byId: eventsById,
      hasLoadedFromServer: eventsHasLoadedFromServer,
      idsToSync: eventsIdsToSync,
      nextCursor: eventsNextCursor,
    });
    if (settingsData) storage.setSettings(userId, settingsData);
  }, [
    eventsAllIds,
    eventsById,
    eventsHasLoadedFromServer,
    eventsIdsToSync,
    eventsNextCursor,
    isStorageLoading,
    settingsData,
    userId,
  ]);
}
