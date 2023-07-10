import * as React from "react";
import useInterval from "./useInterval";
import { eventsGet, eventsPost } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  eventsByIdSelector,
  eventsIdsToSyncSelector,
  eventsIsSyncingFromServerSelector,
  eventsIsSyncingToServerSelector,
  eventsNextCursorSelector,
  userEmailSelector,
  userIsSignedInSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";

export default function useEvents() {
  const eventsById = useSelector(eventsByIdSelector);
  const eventsIdsToSync = useSelector(eventsIdsToSyncSelector);
  const eventsNextCursor = useSelector(eventsNextCursorSelector);
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const isSyncingFromServer = useSelector(eventsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(eventsIsSyncingToServerSelector);
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const dispatch = useDispatch();

  const syncFromServer = (): void =>
    void (async (): Promise<void> => {
      if (!userIsSignedIn || isSyncingFromServer || isStorageLoading) return;
      try {
        let cursor = eventsNextCursor;
        let isPaginating = true;
        while (isPaginating) {
          dispatch(eventsSlice.actions.syncFromServerStart());

          const {
            events: serverEvents,
            hasNextPage,
            nextCursor,
          } = await eventsGet(cursor);
          cursor = nextCursor;
          isPaginating = hasNextPage;

          dispatch(
            eventsSlice.actions.syncFromServerSuccess({
              cursor,
              events: serverEvents,
            }),
          );
        }
      } catch {
        dispatch(eventsSlice.actions.syncFromServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(syncFromServer, [isStorageLoading, userEmail]);
  useInterval(syncFromServer, 6e4);
  React.useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") syncFromServer();
    };
    window.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      window.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  });

  const syncToServer = (): void =>
    void (async () => {
      if (
        !userIsSignedIn ||
        isSyncingToServer ||
        isStorageLoading ||
        !eventsIdsToSync.length
      )
        return;
      dispatch(eventsSlice.actions.syncToServerStart());
      try {
        await eventsPost(eventsIdsToSync.map((id) => eventsById[id]));
        dispatch(eventsSlice.actions.syncToServerSuccess());
      } catch {
        dispatch(eventsSlice.actions.syncToServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(syncToServer, [eventsIdsToSync, isStorageLoading, userEmail]);
  useInterval(syncToServer, 1e4);
}
