import * as React from "react";
import { moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodByWeekdayChart, {
  DayAverages,
} from "../../shared/MoodByWeekdayChart";
import {
  computeAverageMoodInInterval,
  computeMean,
  getWeekdayIndex,
} from "../../../utils";
import { Paper } from "eri";
import { DAYS_PER_WEEK, WEEKDAY_LABELS_SHORT } from "../../../constants";
import addDays from "date-fns/addDays";

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
      <MoodByWeekdayChart averages={averages} />
    </Paper>
  );
}
