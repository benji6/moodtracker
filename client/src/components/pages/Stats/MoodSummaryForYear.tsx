import { useSelector } from "react-redux";
import { normalizedAveragesByYearSelector } from "../../../selectors";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForYear(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByYearSelector);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="year"
    />
  );
}
