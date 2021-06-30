import { Icon, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  eventsIsSyncingFromServerSelector,
  eventsIsSyncingToServerSelector,
  eventsSyncFromServerErrorSelector,
  eventsSyncToServerErrorSelector,
} from "../../selectors";

export default function SyncState() {
  const isSyncingFromServer = useSelector(eventsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(eventsIsSyncingToServerSelector);
  const syncFromServerError = useSelector(eventsSyncFromServerErrorSelector);
  const syncToServerError = useSelector(eventsSyncToServerErrorSelector);

  return (
    <div className="m-nav__sync-state">
      <p className="center">
        {syncFromServerError || syncToServerError ? (
          <>
            Data saved locally
            <Icon draw margin="left" name="save" />
          </>
        ) : isSyncingFromServer ? (
          isSyncingToServer ? (
            <>
              Syncing
              <Spinner inline margin="left" />
            </>
          ) : (
            <>
              Syncing from server
              <Spinner inline margin="left" />
            </>
          )
        ) : isSyncingToServer ? (
          <>
            Syncing to server
            <Spinner inline margin="left" />
          </>
        ) : (
          <>
            Synced with server
            <Icon draw margin="left" name="check" />
          </>
        )}
      </p>
      <hr />
    </div>
  );
}
