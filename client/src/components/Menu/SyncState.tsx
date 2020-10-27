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
    <>
      <hr />
      <p className="center">
        {syncFromServerError || syncToServerError ? (
          <>
            Data saved locally <Icon draw name="save" />
          </>
        ) : isSyncingFromServer ? (
          isSyncingToServer ? (
            <>
              Syncing <Spinner inline />
            </>
          ) : (
            <>
              Syncing from server <Spinner inline />
            </>
          )
        ) : isSyncingToServer ? (
          <>
            Syncing to server <Spinner inline />
          </>
        ) : (
          <>
            Synced with server <Icon draw name="check" />
          </>
        )}
      </p>
    </>
  );
}
