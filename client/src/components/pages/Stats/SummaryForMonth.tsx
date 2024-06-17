import SummaryForCalendarPeriod from "./SummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dates: [Date, Date, Date];
}

export default function SummaryForMonth(props: Props) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByMonth);

  return (
    <SummaryForCalendarPeriod
      {...props}
      meanMoodByDate={meanMoods}
      periodType="month"
    />
  );
}
