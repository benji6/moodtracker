import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef } from "react";
import appSlice from "../../store/appSlice";
import { captureException } from "../../sentry";
import eventsSlice from "../../store/eventsSlice";
import settingsSlice from "../../store/settingsSlice";
import storage from "../../storage";
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

  const lastUserId = useRef<string | undefined>();

  // handle user sign out
  if (lastUserId.current && !userId) {
    storage.deleteEvents(lastUserId.current);
    navigate("/");
  }

  lastUserId.current = userId;

  // save/clear user
  useEffect(() => {
    if (userLoading) return;
    if (!userEmail || !userId) storage.deleteUser();
    else storage.setUser({ email: userEmail, id: userId });
  }, [userEmail, userLoading, userId]);

  // load events & settings
  useEffect(() => {
    if (userLoading || !isStorageLoading) return;
    void (async () => {
      if (!userId) return dispatch(appSlice.actions.storageLoaded());
      try {
        const result = await Promise.race([
          storage.getEventsAndSettings(userId),
          new Promise((resolve) => setTimeout(resolve, 5e3)),
        ]);
        if (result === undefined) {
          const error = Error("Storage did not load within 5 seconds");
          captureException(error);
          throw error;
        }
        const [events, settings] = result as Awaited<
          ReturnType<typeof storage.getEventsAndSettings>
        >;
        if (events) dispatch(eventsSlice.actions.loadFromStorage(events));
        if (settings) dispatch(settingsSlice.actions.loadFromStorage(settings));
      } finally {
        dispatch(appSlice.actions.storageLoaded());
      }
    })();
  }, [dispatch, isStorageLoading, userId, userLoading]);

  // save events & settings
  useEffect(() => {
    if (isStorageLoading || !userId) return;
    const eventsData = {
      allIds: eventsAllIds,
      byId: eventsById,
      hasLoadedFromServer: eventsHasLoadedFromServer,
      idsToSync: eventsIdsToSync,
      nextCursor: eventsNextCursor,
    };
    if (settingsData)
      return void storage.setEventsAndSettings(
        userId,
        eventsData,
        settingsData,
      );

    storage.setEvents(userId, eventsData);
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
