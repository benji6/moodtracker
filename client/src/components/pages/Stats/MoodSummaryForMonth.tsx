import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../selectors";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForMonth(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByMonthSelector);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="month"
    />
  );
}
