import { eventsGet, eventsPost } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import appSlice from "../../store/appSlice";
import { captureException } from "../../sentry";
import eventsSlice from "../../store/eventsSlice";
import { useEffect } from "react";
import useInterval from "./useInterval";
import userSlice from "../../store/userSlice";

export default function useEvents() {
  const eventsById = useSelector(eventsSlice.selectors.byId);
  const eventsIdsToSync = useSelector(eventsSlice.selectors.idsToSync);
  const eventsNextCursor = useSelector(eventsSlice.selectors.nextCursor);
  const isStorageLoading = useSelector(appSlice.selectors.isStorageLoading);
  const isSyncingFromServer = useSelector(
    eventsSlice.selectors.isSyncingFromServer,
  );
  const isSyncingToServer = useSelector(
    eventsSlice.selectors.isSyncingToServer,
  );
  const userEmail = useSelector(userSlice.selectors.email);
  const userIsSignedIn = useSelector(userSlice.selectors.isSignedIn);
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
      } catch (e) {
        captureException(e);
        dispatch(eventsSlice.actions.syncFromServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(syncFromServer, [isStorageLoading, userEmail]);
  useInterval(syncFromServer, 6e4);
  useEffect(() => {
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
  useEffect(syncToServer, [eventsIdsToSync, isStorageLoading, userEmail]);
  useInterval(syncToServer, 1e4);
}
