import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Toggle } from "eri";
import settingsSlice from "../../store/settingsSlice";
import usePermissionState from "../hooks/usePermissionState";

export default function LocationToggle() {
  const locationEnabled = useSelector(settingsSlice.selectors.recordLocation);
  const dispatch = useDispatch();
  const permissionState = usePermissionState("geolocation");

  return (
    <>
      <p>Opt in to record your location against all your events.</p>
      <p>
        If you log your location in MoodTracker you will be able to see where
        you were when you look back through your history and you will be able to
        view location-based stats.
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
              locationEnabled ? false : true,
            ),
          )
        }
        label={
          locationEnabled
            ? permissionState === "granted"
              ? "Storing location against events you record"
              : "Settings saved to device, but not recording location"
            : "Not recording location"
        }
      />
      <p>
        <small>
          For any privacy concerns{" "}
          <Link to="/about/privacy-policy">
            take a look at the privacy policy
          </Link>
          .
        </small>
      </p>
    </>
  );
}
