import { Chart, Paper } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../constants";
import {
  computeMean,
  defaultDict,
  getIdsInInterval,
  moodToColor,
} from "../../../utils";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodBySleepForPeriod({ dateFrom, dateTo }: Props) {
  const meanMoodsByDay = useSelector(eventsSlice.selectors.meanMoodsByDay);
  const minutesSleptByDateAwoke = useSelector(
    eventsSlice.selectors.minutesSleptByDateAwoke,
  );
  const minutesSleptKeys = getIdsInInterval(
    Object.keys(minutesSleptByDateAwoke),
    dateFrom,
    dateTo,
  );
  const meanMoodsKeys = getIdsInInterval(
    Object.keys(meanMoodsByDay),
    dateFrom,
    dateTo,
  );
  if (minutesSleptKeys.length < 2 || meanMoodsKeys.length < 2) return;
  const meanMoodsKeysSet = new Set(meanMoodsKeys);
  const intersectingKeys = minutesSleptKeys.filter((key) =>
    meanMoodsKeysSet.has(key),
  );
  if (intersectingKeys.length < 2) return;

  const points = intersectingKeys.map((key) => {
    const y = meanMoodsByDay[key];
    return {
      color: moodToColor(y),
      x: minutesSleptByDateAwoke[key] / 60,
      y,
    };
  });

  const ysByX = defaultDict((): number[] => []);
  // Round to nearest 6 for a resolution of 10 minutes
  for (const { x, y } of points) ysByX[Math.round(x * 6) / 6].push(y);
  const linePoints = Object.keys(ysByX).map((x) => ({
    x: Number(x),
    y: computeMean(ysByX[x]),
  }));

  return (
    <Paper>
      <h3>Average mood by time slept</h3>
      <Chart.LineChart
        aria-label="Chart displaying mood against time slept"
        domain={[0, Math.ceil(Math.max(...points.map(({ x }) => x)) / 5) * 5]}
        points={points}
        range={MOOD_RANGE}
        xAxisTitle="Hours slept"
        yAxisLabels={MOOD_INTEGERS.map(String)}
        yAxisTitle="Mood"
      >
        <Chart.Line
          thickness={2}
          data={linePoints
            .map(({ x, y }): [number, number] => [x, y])
            .sort(([a], [b]) => a - b)}
        />
      </Chart.LineChart>
    </Paper>
  );
}
