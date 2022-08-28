import { Toggle } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { settingsRecordLocationSelector } from "../../selectors";
import settingsSlice from "../../store/settingsSlice";
import usePermissionState from "../hooks/usePermissionState";

export default function LocationToggle() {
  const locationEnabled = useSelector(settingsRecordLocationSelector);
  const dispatch = useDispatch();
  const permissionState = usePermissionState("geolocation");

  return (
    <>
      <p>
        Opt in to record your location against all your events so you can see
        where you were when you look back through your history.
      </p>
      <Toggle
        checked={locationEnabled}
        error={
          permissionState === "denied"
            ? "Location permission denied, if you want to use this feature you will need to enable this permission in your browser"
            : undefined
        }
        onChange={() =>
          dispatch(
            settingsSlice.actions.setLocationRecording(
              locationEnabled ? false : true
            )
          )
        }
        label={
          locationEnabled
            ? permissionState === "granted"
              ? "Storing location against events you record"
              : "Settings saved, but not recording location"
            : "Not recording location"
        }
      />
    </>
  );
}
