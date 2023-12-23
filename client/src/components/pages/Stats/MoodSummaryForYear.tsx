import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForYear(props: Props) {
  const normalizedAverages = useSelector(
    eventsSlice.selectors.normalizedAveragesByYear,
  );

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="year"
    />
  );
}
