import { Icon, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { eventsIsSyncingFromServerSelector } from "../../selectors";

export default function SyncState() {
  const isSyncingFromServer = useSelector(eventsIsSyncingFromServerSelector);
  const isSyncingToServer = useSelector(eventsIsSyncingFromServerSelector);
  const syncFromServerError = useSelector(eventsIsSyncingFromServerSelector);
  const syncToServerError = useSelector(eventsIsSyncingFromServerSelector);

  return (
    <div className="m-menu__footer">
      <hr />
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
    </div>
  );
}
