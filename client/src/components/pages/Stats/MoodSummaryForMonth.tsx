import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../selectors";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForMonth(props: Props) {
  const normalizedAverages = useSelector(normalizedAveragesByMonthSelector);

  return (
    <MoodSummaryForPeriod
      {...props}
      normalizedAverages={normalizedAverages}
      periodType="month"
    />
  );
}
