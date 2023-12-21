import { useSelector } from "react-redux";
import {
  computeMeanSafe,
  formatIsoDateHourInLocalTimezone,
} from "../../../utils";
import { Paper } from "eri";
import { TIME } from "../../../constants";
import MoodByHourChart from "../../shared/MoodByHourChart";
import { addHours } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByHourForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedAveragesByHour = useSelector(
    eventsSlice.selectors.normalizedAveragesByHour,
  );
  const moodsByHourIndex: (number[] | undefined)[] = [
    ...Array(TIME.daysPerWeek),
  ];

  for (let t0 = dateFrom; t0 < dateTo; t0 = addHours(t0, 1)) {
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
    const mean = computeMeanSafe(moods);
    if (!mean) continue;
    averages.push([i, mean]);
  }

  if (averages.length < 2) return;

  return (
    <Paper>
      <h3>Average mood by hour</h3>
      <MoodByHourChart data={averages} />
    </Paper>
  );
}
