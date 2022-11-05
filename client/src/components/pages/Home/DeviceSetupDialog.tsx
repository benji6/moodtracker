import { Dialog } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { TEST_IDS } from "../../../constants";
import { appShowNewSignInUiSelector } from "../../../selectors";
import appSlice from "../../../store/appSlice";
import LocationToggle from "../../shared/LocationToggle";

export default function DeviceSetupDialog() {
  const userHasManuallySignedIn = useSelector(appShowNewSignInUiSelector);
  const dispatch = useDispatch();

  return (
    <Dialog
      data-test-id={TEST_IDS.deviceSpecificSettingsDialog}
      open={userHasManuallySignedIn}
      title="Check your device-specific settings"
      onClose={() => dispatch(appSlice.actions.dismissNewSignInUi())}
    >
      <h4 style={{ marginTop: 0 }}>Location settings</h4>
      <LocationToggle />
    </Dialog>
  );
}
