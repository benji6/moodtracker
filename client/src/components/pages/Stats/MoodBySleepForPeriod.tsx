import { Chart, Paper } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../constants";
import {
  compareFunctionForStringSorting,
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
    Object.keys(minutesSleptByDateAwoke).sort(compareFunctionForStringSorting),
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
  if (intersectingKeys.length < 5) return;

  const ysByX = defaultDict((): number[] => []);
  const lineYsByX = defaultDict((): number[] => []);
  for (const key of intersectingKeys) {
    const x = minutesSleptByDateAwoke[key] / 60;
    const y = meanMoodsByDay[key];

    ysByX[x].push(y);
    // Round to nearest 2 for a resolution of 30 minutes
    lineYsByX[Math.round(x * 2) / 2].push(y);
  }
  const points = Object.keys(ysByX).map((x) => {
    const y = computeMean(ysByX[x]);
    return {
      color: moodToColor(y),
      x: Number(x),
      y,
    };
  });
  const linePoints = Object.keys(lineYsByX).map((x) => ({
    x: Number(x),
    y: computeMean(lineYsByX[x]),
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
