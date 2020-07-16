import { Icon, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../AppState";

export default function SyncState() {
  const {
    isSyncingFromServer,
    isSyncingToServer,
    syncFromServerError,
    syncToServerError,
  } = React.useContext(StateContext);

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
