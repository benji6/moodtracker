import { Paper, Spinner } from "eri";
import { useState } from "react";
import { useSelector } from "react-redux";
import { TIME } from "../../constants";
import {
  deviceGeolocationSelector,
  settingsRecordLocationSelector,
} from "../../selectors";
import useInterval from "../hooks/useInterval";
import Location from "./Location";

export default function LiveLocation() {
  const geolocation = useSelector(deviceGeolocationSelector);
  const shouldRecordLocation = useSelector(settingsRecordLocationSelector);
  const [date, setDate] = useState(new Date());

  useInterval(() => {
    setDate(new Date());
  }, TIME.secondsPerHour * 1e3);

  if (!shouldRecordLocation) return null;

  return geolocation ? (
    <Location
      date={date}
      latitude={geolocation.latitude}
      longitude={geolocation.longitude}
    />
  ) : (
    <>
      <Paper>
        <h3>Weather</h3>
        <Spinner />
      </Paper>
      <Paper>
        <h3>Location</h3>
        <Spinner />
      </Paper>
    </>
  );
}
