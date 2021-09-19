import { Toggle } from "eri";
import * as React from "react";
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
      label={locationEnabled ? "Recording location" : "Not recording location"}
    />
  );
}
