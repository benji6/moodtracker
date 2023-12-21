import { useSelector } from "react-redux";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForDay(props: Props) {
  const normalizedAverages = useSelector(
    eventsSlice.selectors.normalizedAveragesByDay,
  );

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="day"
    />
  );
}
