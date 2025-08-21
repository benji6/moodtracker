import { Paper, Spinner } from "eri";
import Location from "./Location";
import { TIME } from "../../constants";
import deviceSlice from "../../store/deviceSlice";
import settingsSlice from "../../store/settingsSlice";
import useInterval from "../hooks/useInterval";
import { useSelector } from "react-redux";
import { useState } from "react";

interface Props {
  date?: Date;
}

export default function LiveLocation({ date: dateProps }: Props) {
  const geolocation = useSelector(deviceSlice.selectors.geolocation);
  const shouldRecordLocation = useSelector(
    settingsSlice.selectors.recordLocation,
  );
  const [currentDate, setCurrentDate] = useState(new Date());

  useInterval(() => {
    if (!dateProps) setCurrentDate(new Date());
  }, TIME.secondsPerHour * 1e3);

  if (!shouldRecordLocation) return;

  return geolocation ? (
    <Location date={dateProps || currentDate} {...geolocation} />
  ) : (
    <>
      <Paper>
        <h3>Location</h3>
        <Spinner />
      </Paper>
      <Paper>
        <h3>Weather</h3>
        <Spinner />
      </Paper>
    </>
  );
}
