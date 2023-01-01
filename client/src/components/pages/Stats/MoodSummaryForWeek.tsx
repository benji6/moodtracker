import { useSelector } from "react-redux";
import { normalizedAveragesByWeekSelector } from "../../../selectors";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForWeek(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByWeekSelector);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="week"
    />
  );
}
