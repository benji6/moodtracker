import { ComponentProps } from "react";
import MoodSummaryForCalendarPeriod from "./MoodSummaryForCalendarPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function MoodSummaryForDay(
  props: Pick<
    ComponentProps<typeof MoodSummaryForCalendarPeriod>,
    "dates" | "heading"
  >,
) {
  const meanMoods = useSelector(eventsSlice.selectors.meanMoodsByDay);

  return (
    <MoodSummaryForCalendarPeriod
      {...props}
      meanMoodByDate={meanMoods}
      periodType="day"
    />
  );
}
