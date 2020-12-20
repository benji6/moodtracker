import * as React from "react";
import { DayAverages, moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodByWeekdayChart from "../../shared/MoodByWeekdayChart";
import { computeAverageMoodInInterval } from "../../../utils";
import { addDays } from "date-fns";
import { weekdayFormatterShort } from "../../../formatters";
import { Paper } from "eri";

interface Props {
  fromDate: Date;
  toDate: Date;
}
export default function MoodByWeekdayForPeriod({ fromDate, toDate }: Props) {
  const moods = useSelector(moodsSelector);
  const averages: [string, number | undefined][] = [];

  for (let t0 = fromDate; t0 < toDate; t0 = addDays(t0, 1)) {
    try {
      const averageMood = computeAverageMoodInInterval(
        moods,
        t0,
        addDays(t0, 1)
      );
      averages.push([weekdayFormatterShort.format(t0), averageMood]);
    } catch {
      averages.push([weekdayFormatterShort.format(t0), undefined]);
    }
  }

  return (
    <Paper>
      <h3>Average mood by weekday</h3>
      <MoodByWeekdayChart averages={averages as DayAverages} />
    </Paper>
  );
}
