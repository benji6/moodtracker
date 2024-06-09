import { addWeeks, subWeeks } from "date-fns";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import { ReactNode } from "react";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  heading?: ReactNode;
}

export default function MoodSummaryForWeek({ date, ...rest }: Props) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByWeek);

  return (
    <MoodSummaryForCalendarPeriod
      {...rest}
      dates={[subWeeks(date, 1), date, addWeeks(date, 1)]}
      meanMoodByDate={meanMoods}
      periodType="week"
    />
  );
}
