import { useSelector } from "react-redux";
import { normalizedAveragesByDaySelector } from "../../../selectors";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForDay(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByDaySelector);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="day"
    />
  );
}
