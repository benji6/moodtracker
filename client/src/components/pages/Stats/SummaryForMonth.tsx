import { addMonths, startOfMonth, subMonths } from "date-fns";
import { ReactNode } from "react";
import SummaryForCalendarPeriod from "./SummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  heading?: ReactNode;
}

export default function SummaryForMonth({ date, ...rest }: Props) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByMonth);
  const startOfMonthDate = startOfMonth(date);

  return (
    <SummaryForCalendarPeriod
      {...rest}
      dates={[
        subMonths(startOfMonthDate, 1),
        startOfMonthDate,
        addMonths(startOfMonthDate, 1),
      ]}
      meanMoodByDate={meanMoods}
      periodType="month"
    />
  );
}
