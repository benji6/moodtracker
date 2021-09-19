import * as React from "react";
import { settingsGet, settingsSet } from "../../api";
import { useDispatch, useSelector } from "react-redux";
import {
  appIsStorageLoadingSelector,
  settingsIsSyncingFromServerSelector,
  settingsIsSyncingToServerSelector,
  settingsDataSelector,
  settingsShouldSyncToServerSelector,
  userEmailSelector,
  userIsSignedInSelector,
} from "../../selectors";
import settingsSlice from "../../store/settingsSlice";
import useInterval from "./useInterval";

export default function useSettings() {
  const dispatch = useDispatch();
  const isStorageLoading = useSelector(appIsStorageLoadingSelector);
  const isSyncingFromServer = useSelector(settingsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(settingsIsSyncingToServerSelector);
  const settingsData = useSelector(settingsDataSelector);
  const shouldSyncToServer = useSelector(settingsShouldSyncToServerSelector);
  const userEmail = useSelector(userEmailSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  const syncFromServer = (): void =>
    void (async (): Promise<void> => {
      if (!userIsSignedIn || isSyncingFromServer || isStorageLoading) return;
      try {
        dispatch(settingsSlice.actions.syncFromServerStart());
        const serverSettings = await settingsGet();
        dispatch(settingsSlice.actions.syncFromServerSuccess(serverSettings));
      } catch {
        dispatch(settingsSlice.actions.syncFromServerError());
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
        !shouldSyncToServer ||
        !settingsData
      )
        return;
      dispatch(settingsSlice.actions.syncToServerStart());
      try {
        await settingsSet(settingsData);
        dispatch(settingsSlice.actions.syncToServerSuccess());
      } catch (e) {
        if (e instanceof Error && e.message === "409") {
          dispatch(settingsSlice.actions.syncToServerSuccess());
          syncFromServer();
          return;
        }
        dispatch(settingsSlice.actions.syncToServerError());
      }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(syncToServer, [
    shouldSyncToServer,
    isStorageLoading,
    userEmail,
  ]);
  useInterval(syncToServer, 1e4);
}
