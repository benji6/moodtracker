import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dates: [Date, Date, Date];
}

export default function MoodSummaryForMonth(props: Props) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByMonth);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      meanMoodByDate={meanMoods}
      periodType="month"
    />
  );
}
