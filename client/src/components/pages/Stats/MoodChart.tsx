import { Chart } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { MOOD_RANGE } from "../../../constants";
import { moodsSelector } from "../../../selectors";
import { NormalizedMoods } from "../../../types";
import {
  computeAverageMoodInInterval,
  getEnvelopingMoodIds,
  moodToColor,
} from "../../../utils";

const TRENDLINE_POINTS_COUNT = 32;
const TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT = 3;

export const computeTrendlinePoints = (
  moods: NormalizedMoods,
  domain: [number, number]
): [number, number][] => {
  const period = (domain[1] - domain[0]) / TRENDLINE_POINTS_COUNT;
  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1]
  ).getTime();

  const trendlinePoints: [number, number][] = [];

  for (let i = 0; i < TRENDLINE_POINTS_COUNT + 1; i++) {
    const t0 =
      domain[0] + (i - TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT / 2) * period;
    const t1 = t0 + period * TRENDLINE_MOVING_AVERAGE_PERIOD_COUNT;
    const trendlineX = (t0 + t1) / 2;
    if (trendlineX < earliestMoodTime) continue;
    if (trendlineX > latestMoodTime) break;
    const mood = computeAverageMoodInInterval(
      moods,
      new Date(t0),
      new Date(t1)
    );
    trendlinePoints.push([trendlineX, mood]);
  }

  return trendlinePoints;
};

interface Props {
  fromDate: Date;
  hidePoints?: boolean;
  toDate: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function MoodChart({
  fromDate,
  hidePoints = false,
  toDate,
  xLabels,
  xLines = xLabels.map(([x]) => x),
}: Props) {
  const moods = useSelector(moodsSelector);
  const domain: [number, number] = [fromDate.getTime(), toDate.getTime()];
  const envelopingMoodIds = getEnvelopingMoodIds(
    moods.allIds,
    fromDate,
    toDate
  );
  const data: [number, number][] = envelopingMoodIds.map((id) => {
    const mood = moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });
  const yLabels: [number, string][] = [
    ...Array(MOOD_RANGE[1] + 1).keys(),
  ].map((y) => [y, String(y)]);

  const yLines = yLabels.map(([y]) => y);

  return (
    <Chart.LineChart
      aria-label="Chart displaying mood against time"
      domain={domain}
      range={MOOD_RANGE}
      xAxisTitle="Date"
      yAxisTitle="Mood"
    >
      <Chart.XGridLines lines={xLines} />
      <Chart.YGridLines lines={yLines} />
      <Chart.PlotArea>
        <Chart.Line
          color={hidePoints ? undefined : "var(--e-color-balance-less)"}
          data={computeTrendlinePoints(
            { ...moods, allIds: envelopingMoodIds },
            domain
          )}
          thickness={2}
        />
        <Chart.Line
          color={hidePoints ? "var(--e-color-balance-less)" : undefined}
          data={data}
        />
        {!hidePoints && <Chart.Points colorFromY={moodToColor} data={data} />}
      </Chart.PlotArea>
      <Chart.XAxis labels={xLabels} markers={xLines} />
      <Chart.YAxis labels={yLabels} markers={yLines} />
    </Chart.LineChart>
  );
}
