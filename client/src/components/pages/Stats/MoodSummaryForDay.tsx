import { useSelector } from "react-redux";
import { normalizedAveragesByDaySelector } from "../../../selectors";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForDay(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByDaySelector);

  return (
    <MoodSummaryForPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="day"
    />
  );
}
