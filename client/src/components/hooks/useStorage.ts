import * as React from "react";
import storage from "../../storage";
import { useDispatch, useSelector } from "react-redux";
import eventsSlice from "../../store/eventsSlice";
import appSlice from "../../store/appSlice";
import settingsSlice from "../../store/settingsSlice";
import { useNavigate } from "react-router-dom";
import userSlice from "../../store/userSlice";

export default function useStorage() {
  const navigate = useNavigate();
  const eventsAllIds = useSelector(eventsSlice.selectors.allIds);
  const eventsById = useSelector(eventsSlice.selectors.byId);
  const eventsHasLoadedFromServer = useSelector(
    eventsSlice.selectors.hasLoadedFromServer,
  );
  const eventsIdsToSync = useSelector(eventsSlice.selectors.idsToSync);
  const eventsNextCursor = useSelector(eventsSlice.selectors.nextCursor);
  const isStorageLoading = useSelector(appSlice.selectors.isStorageLoading);
  const settingsData = useSelector(settingsSlice.selectors.data);
  const userEmail = useSelector(userSlice.selectors.email);
  const userId = useSelector(userSlice.selectors.id);
  const userLoading = useSelector(userSlice.selectors.loading);
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
