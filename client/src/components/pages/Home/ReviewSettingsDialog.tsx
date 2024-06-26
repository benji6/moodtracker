import { useDispatch, useSelector } from "react-redux";
import { Dialog } from "eri";
import EventTrackingSettings from "../../shared/EventTrackingSettings";
import LocationToggle from "../../shared/LocationToggle";
import { TEST_IDS } from "../../../constants";
import WebPushNotifications from "../../shared/NotificationSettings/WebPushNotifications";
import WeeklyEmailNotifications from "../../shared/NotificationSettings/WeeklyEmailNotifications";
import appSlice from "../../../store/appSlice";

export default function ReviewSettingsDialog() {
  const userHasManuallySignedIn = useSelector(
    appSlice.selectors.showNewSignInUi,
  );
  const dispatch = useDispatch();

  return (
    <Dialog
      data-test-id={TEST_IDS.deviceSetupDialog}
      open={userHasManuallySignedIn}
      title="Review your settings"
      onClose={() => dispatch(appSlice.actions.dismissNewSignInUi())}
    >
      <p>
        <small>
          Some settings are device-specific so make sure everything is set-up
          how you like it.
        </small>
      </p>
      <h4>Daily push notifications</h4>
      <WebPushNotifications />
      <h4>Weekly email updates</h4>
      <WeeklyEmailNotifications />
      <h4>Location settings</h4>
      <LocationToggle />
      <h4>Event settings</h4>
      <EventTrackingSettings />
    </Dialog>
  );
}
