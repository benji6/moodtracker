import { addWeeks, startOfWeek, subWeeks } from "date-fns";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import { ReactNode } from "react";
import { WEEK_OPTIONS } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  heading?: ReactNode;
}

export default function MoodSummaryForWeek({ date, ...rest }: Props) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByWeek);
  const startOfWeekDate = startOfWeek(date, WEEK_OPTIONS);

  return (
    <MoodSummaryForCalendarPeriod
      {...rest}
      dates={[
        subWeeks(startOfWeekDate, 1),
        startOfWeekDate,
        addWeeks(startOfWeekDate, 1),
      ]}
      meanMoodByDate={meanMoods}
      periodType="week"
    />
  );
}
