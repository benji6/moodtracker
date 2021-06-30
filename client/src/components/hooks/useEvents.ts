import * as React from "react";
import useInterval from "./useInterval";
import { getEvents, postEvents } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  eventsIsSyncingFromServerSelector,
  eventsSelector,
  userEmailSelector,
  userIsSignedInSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";

export default function useEvents() {
  const events = useSelector(eventsSelector);
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const isSyncingFromServer = useSelector(eventsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(eventsIsSyncingFromServerSelector);
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);
  const dispatch = useDispatch();

  const syncFromServer = (): void =>
    void (async (): Promise<void> => {
      if (!userIsSignedIn || isSyncingFromServer || isStorageLoading) return;
      try {
        let cursor = events.nextCursor;
        let isPaginating = true;
        while (isPaginating) {
          dispatch(eventsSlice.actions.syncFromServerStart());

          const {
            events: serverEvents,
            hasNextPage,
            nextCursor,
          } = await getEvents(cursor);
          cursor = nextCursor;
          isPaginating = hasNextPage;

          dispatch(
            eventsSlice.actions.syncFromServerSuccess({
              cursor,
              events: serverEvents,
            })
          );
        }
      } catch {
        dispatch(eventsSlice.actions.syncFromServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(syncFromServer, [isStorageLoading, userEmail]);
  useInterval(syncFromServer, 6e4);

  const syncToServer = (): void =>
    void (async () => {
      if (
        !userIsSignedIn ||
        isSyncingToServer ||
        isStorageLoading ||
        !events.idsToSync.length
      )
        return;
      dispatch(eventsSlice.actions.syncToServerStart());
      try {
        await postEvents(events.idsToSync.map((id) => events.byId[id]));
        dispatch(eventsSlice.actions.syncToServerSuccess());
      } catch {
        dispatch(eventsSlice.actions.syncToServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(syncToServer, [
    events.idsToSync,
    isStorageLoading,
    userEmail,
  ]);
  useInterval(syncToServer, 1e4);
}
