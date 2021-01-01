import * as React from "react";
import { moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodByWeekdayChart, {
  DayAverages,
} from "../../shared/MoodByWeekdayChart";
import { computeAverageMoodInInterval, computeMean } from "../../../utils";
import { addDays, getDay, startOfWeek } from "date-fns";
import { Paper } from "eri";
import { DAYS_PER_WEEK } from "../../../constants";
import { weekdayFormatterShort, WEEK_OPTIONS } from "../../../formatters";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodByWeekdayForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(moodsSelector);
  const moodsByWeekdayIndex: (number[] | undefined)[] = [
    ...Array(DAYS_PER_WEEK),
  ];

  for (let t0 = fromDate; t0 < toDate; t0 = addDays(t0, 1)) {
    const mood = computeAverageMoodInInterval(moods, t0, addDays(t0, 1));
    if (mood === undefined) continue;
    const dateFnsWeekdayIndex = getDay(t0);
    const weekdayIndex =
      (dateFnsWeekdayIndex ? dateFnsWeekdayIndex : DAYS_PER_WEEK) - 1;
    const moodsForWeekday = moodsByWeekdayIndex[weekdayIndex];
    if (moodsForWeekday) moodsForWeekday.push(mood);
    else moodsByWeekdayIndex[weekdayIndex] = [mood];
  }

  const startOfWeekDate = startOfWeek(fromDate, WEEK_OPTIONS);

  const averages = moodsByWeekdayIndex.map((moodsForWeekday, i) => [
    weekdayFormatterShort.format(addDays(startOfWeekDate, i)),
    moodsForWeekday && computeMean(moodsForWeekday),
  ]) as DayAverages;

  return (
    <Paper>
      <h3>Average mood by weekday</h3>
      <MoodByWeekdayChart averages={averages} />
    </Paper>
  );
}
