import * as React from "react";
import { StateContext } from "../AppState";
import useInterval from "./useInterval";
import { getEvents, postEvents } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  eventsIsSyncingFromServerSelector,
  eventsSelector,
  userEmailSelector,
  userIsSignedInSelector,
} from "../../selectors";
import eventsSlice from "../../store/eventsSlice";

export default function useEvents() {
  const dispatch = useDispatch();
  const isSyncingFromServer = useSelector(eventsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(eventsIsSyncingFromServerSelector);
  const state = React.useContext(StateContext);
  const events = useSelector(eventsSelector);
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  const syncFromServer = (): void =>
    void (async (): Promise<void> => {
      if (!userIsSignedIn || isSyncingFromServer || state.isStorageLoading)
        return;
      dispatch(eventsSlice.actions.syncFromServerStart());
      try {
        const { events: serverEvents, nextCursor } = await getEvents(
          events.nextCursor
        );
        dispatch(
          eventsSlice.actions.syncFromServerSuccess({
            cursor: nextCursor,
            events: serverEvents,
          })
        );
      } catch {
        dispatch(eventsSlice.actions.syncFromServerError());
      }
    })();
  React.useEffect(syncFromServer, [state.isStorageLoading, userEmail]);
  useInterval(syncFromServer, 6e4);

  const syncToServer = (): void =>
    void (async () => {
      if (
        !userIsSignedIn ||
        isSyncingToServer ||
        state.isStorageLoading ||
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
  React.useEffect(syncToServer, [
    events.idsToSync,
    state.isStorageLoading,
    userEmail,
  ]);
  useInterval(syncToServer, 1e4);
}
