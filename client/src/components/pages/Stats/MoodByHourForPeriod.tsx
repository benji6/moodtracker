import * as React from "react";
import { normalizedAveragesByHourSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import { computeMean, formatIsoDateHourInLocalTimezone } from "../../../utils";
import { Paper } from "eri";
import { TIME } from "../../../constants";
import addHours from "date-fns/addHours";
import MoodByHourChart from "../../shared/MoodByHourChart";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function MoodByHourForPeriod({ fromDate, toDate }: Props) {
  const normalizedAveragesByHour = useSelector(
    normalizedAveragesByHourSelector
  );
  const moodsByHourIndex: (number[] | undefined)[] = [
    ...Array(TIME.daysPerWeek),
  ];

  for (let t0 = fromDate; t0 < toDate; t0 = addHours(t0, 1)) {
    const mood =
      normalizedAveragesByHour.byId[formatIsoDateHourInLocalTimezone(t0)];
    if (mood === undefined) continue;
    const hourIndex = t0.getHours(); //
    const moodsForHour = moodsByHourIndex[hourIndex];
    if (moodsForHour) moodsForHour.push(mood);
    else moodsByHourIndex[hourIndex] = [mood];
  }

  const averages: [number, number][] = [];
  for (let i = 0; i < moodsByHourIndex.length; i++) {
    const moods = moodsByHourIndex[i];
    if (!moods) continue;
    const mean = computeMean(moods);
    if (!mean) continue;
    averages.push([i, mean]);
  }

  return (
    <Paper>
      <h3>Average mood by hour</h3>
      <MoodByHourChart data={averages} />
    </Paper>
  );
}
