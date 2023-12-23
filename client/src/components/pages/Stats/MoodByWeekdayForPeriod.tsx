import { TIME, WEEKDAY_LABELS_SHORT } from "../../../constants";
import {
  computeMeanSafe,
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
} from "../../../utils";
import { ComponentProps } from "react";
import MoodByWeekdayChart from "../../shared/MoodByWeekdayChart";
import { Paper } from "eri";
import { addDays } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  canDrillDown?: boolean;
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByWeekdayForPeriod({
  canDrillDown,
  dateFrom,
  dateTo,
}: Props) {
  const normalizedAveragesByDay = useSelector(
    eventsSlice.selectors.normalizedAveragesByDay,
  );
  const navigate = useNavigate();

  const moodsByWeekdayIndex: (number[] | undefined)[] = [
    ...Array(TIME.daysPerWeek),
  ];
  const dateStrings: string[] = [];

  for (let t0 = dateFrom; t0 < dateTo; t0 = addDays(t0, 1)) {
    const dateString = formatIsoDateInLocalTimezone(t0);
    dateStrings.push(dateString);
    const mood = normalizedAveragesByDay.byId[dateString];
    if (mood === undefined) continue;
    const weekdayIndex = getWeekdayIndex(t0);
    const moodsForWeekday = moodsByWeekdayIndex[weekdayIndex];
    if (moodsForWeekday) moodsForWeekday.push(mood);
    else moodsByWeekdayIndex[weekdayIndex] = [mood];
  }

  const averages = moodsByWeekdayIndex.map((moodsForWeekday, i) => [
    WEEKDAY_LABELS_SHORT[i],
    moodsForWeekday && computeMeanSafe(moodsForWeekday),
  ]) as ComponentProps<typeof MoodByWeekdayChart>["averages"];

  return (
    <Paper>
      <h3>Average mood by weekday</h3>
      <MoodByWeekdayChart
        averages={averages}
        onClick={
          canDrillDown
            ? (i) => navigate(`/stats/days/${dateStrings[i]}`)
            : undefined
        }
      />
    </Paper>
  );
}
