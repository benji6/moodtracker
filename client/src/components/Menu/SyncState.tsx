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
            <Icon draw name="save" />
            Data saved locally
          </>
        ) : isSyncingFromServer ? (
          isSyncingToServer ? (
            <>
              <Spinner inline /> Syncing
            </>
          ) : (
            <>
              <Spinner inline /> Syncing from server
            </>
          )
        ) : isSyncingToServer ? (
          <>
            <Spinner inline /> Syncing to server
          </>
        ) : (
          <>
            <Icon draw name="check" />
            Synced with server
          </>
        )}
      </p>
    </div>
  );
}
