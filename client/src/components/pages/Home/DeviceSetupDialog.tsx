import { Dialog } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { appShowNewSignInUiSelector } from "../../../selectors";
import appSlice from "../../../store/appSlice";
import DailyNotifications from "../../shared/DailyNotifications";
import LocationToggle from "../../shared/LocationToggle";

export default function DeviceSetupDialog() {
  const userHasManuallySignedIn = useSelector(appShowNewSignInUiSelector);
  const dispatch = useDispatch();

  return (
    <Dialog
      open={userHasManuallySignedIn}
      title="Check your device-specific settings"
      onClose={() => dispatch(appSlice.actions.dismissNewSignInUi())}
    >
      <h4 style={{ marginTop: 0 }}>Location settings</h4>
      <LocationToggle />
      <h4>Daily notifications</h4>
      <DailyNotifications />
    </Dialog>
  );
}
