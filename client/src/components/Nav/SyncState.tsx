import { Icon, Spinner } from "eri";
import { useSelector } from "react-redux";
import eventsSlice from "../../store/eventsSlice";

export default function SyncState() {
  const isSyncingFromServer = useSelector(
    eventsSlice.selectors.isSyncingFromServer,
  );
  const isSyncingToServer = useSelector(
    eventsSlice.selectors.isSyncingToServer,
  );
  const syncFromServerError = useSelector(
    eventsSlice.selectors.syncFromServerError,
  );
  const syncToServerError = useSelector(
    eventsSlice.selectors.syncToServerError,
  );

  return (
    <div className="m-nav__sync-state">
      <p className="center">
        {syncFromServerError || syncToServerError ? (
          <>
            Data saved locally
            <Icon draw margin="start" name="save" />
          </>
        ) : isSyncingFromServer ? (
          isSyncingToServer ? (
            <>
              Syncing
              <Spinner inline margin="start" />
            </>
          ) : (
            <>
              Syncing from server
              <Spinner inline margin="start" />
            </>
          )
        ) : isSyncingToServer ? (
          <>
            Syncing to server
            <Spinner inline margin="start" />
          </>
        ) : (
          <>
            Synced with server
            <Icon draw margin="start" name="check" />
          </>
        )}
      </p>
      <hr />
    </div>
  );
}
