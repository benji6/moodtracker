import { ComponentProps } from "react";
import SummaryForCalendarPeriod from "./SummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SummaryForDay(
  props: Pick<
    ComponentProps<typeof SummaryForCalendarPeriod>,
    "dates" | "heading"
  >,
) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByDay);

  return (
    <SummaryForCalendarPeriod
      {...props}
      meanMoodByDate={meanMoods}
      periodType="day"
    />
  );
}
