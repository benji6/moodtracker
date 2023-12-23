import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "eri";
import LocationToggle from "../../shared/LocationToggle";
import { TEST_IDS } from "../../../constants";
import WebPushNotifications from "../../shared/NotificationSettings/WebPushNotifications";
import appSlice from "../../../store/appSlice";

export default function DeviceSetupDialog() {
  const userHasManuallySignedIn = useSelector(
    appSlice.selectors.showNewSignInUi,
  );
  const dispatch = useDispatch();

  return (
    <Dialog
      data-test-id={TEST_IDS.deviceSpecificSettingsDialog}
      open={userHasManuallySignedIn}
      title="Check your device-specific settings"
      onClose={() => dispatch(appSlice.actions.dismissNewSignInUi())}
    >
      <h4>Daily push notifications</h4>
      <WebPushNotifications />
      <h4 style={{ marginTop: 0 }}>Location settings</h4>
      <LocationToggle />
    </Dialog>
  );
}
