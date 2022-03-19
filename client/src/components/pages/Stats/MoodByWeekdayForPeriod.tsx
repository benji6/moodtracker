import { normalizedAveragesByDaySelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodByWeekdayChart, {
  DayAverages,
} from "../../shared/MoodByWeekdayChart";
import {
  computeMean,
  formatIsoDateInLocalTimezone,
  getWeekdayIndex,
} from "../../../utils";
import { Paper } from "eri";
import { TIME, WEEKDAY_LABELS_SHORT } from "../../../constants";
import addDays from "date-fns/addDays";
import { useNavigate } from "react-router-dom";

interface Props {
  canDrillDown?: boolean;
  fromDate: Date;
  toDate: Date;
}

export default function MoodByWeekdayForPeriod({
  canDrillDown,
  fromDate,
  toDate,
}: Props) {
  const normalizedAveragesByDay = useSelector(normalizedAveragesByDaySelector);
  const navigate = useNavigate();

  const moodsByWeekdayIndex: (number[] | undefined)[] = [
    ...Array(TIME.daysPerWeek),
  ];
  const dateStrings: string[] = [];

  for (let t0 = fromDate; t0 < toDate; t0 = addDays(t0, 1)) {
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
    moodsForWeekday && computeMean(moodsForWeekday),
  ]) as DayAverages;

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
