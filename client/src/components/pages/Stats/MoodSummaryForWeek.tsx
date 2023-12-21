import { useSelector } from "react-redux";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForWeek(props: Props) {
  const normalizedAverages = useSelector(
    eventsSlice.selectors.normalizedAveragesByWeek,
  );

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="week"
    />
  );
}
