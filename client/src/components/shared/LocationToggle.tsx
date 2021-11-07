import { Toggle } from "eri";
import { useDispatch, useSelector } from "react-redux";
import { settingsRecordLocationSelector } from "../../selectors";
import settingsSlice from "../../store/settingsSlice";

export default function LocationToggle() {
  const locationEnabled = useSelector(settingsRecordLocationSelector);
  const dispatch = useDispatch();

  return (
    <Toggle
      checked={locationEnabled}
      onChange={async () => {
        dispatch(
          settingsSlice.actions.setLocationRecording(
            locationEnabled ? false : true
          )
        );
      }}
      label={
        locationEnabled
          ? "Storing location against events you record"
          : "Not recording location"
      }
    />
  );
}
