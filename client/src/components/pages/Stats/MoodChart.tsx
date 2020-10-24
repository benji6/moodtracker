import { LineChart } from "eri";
import * as React from "react";
import { MOOD_RANGE } from "../../../constants";
import { NormalizedMoods } from "../../../types";
import {
  computeAverageMoodInInterval,
  getEnvelopingMoodIds,
  moodToColor,
} from "../../../utils";
import { StateContext } from "../../AppState";

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
  toDate: Date;
  xLabels: [number, string][];
}

export default function MoodChart({ fromDate, toDate, xLabels }: Props) {
  const state = React.useContext(StateContext);
  const domain: [number, number] = [fromDate.getTime(), toDate.getTime()];
  const envelopingMoodIds = getEnvelopingMoodIds(
    state.moods.allIds,
    fromDate,
    toDate
  );
  const data: [number, number][] = envelopingMoodIds.map((id) => {
    const mood = state.moods.byId[id];
    return [new Date(id).getTime(), mood.mood];
  });

  return (
    <LineChart
      aria-label="Chart displaying mood against time"
      colorFromY={moodToColor}
      data={data}
      domain={domain}
      range={MOOD_RANGE}
      trendlinePoints={computeTrendlinePoints(
        { ...state.moods, allIds: envelopingMoodIds },
        domain
      )}
      xAxisLabel="Date"
      xLabels={xLabels}
      yAxisLabel="Mood"
      yLabels={[...Array(MOOD_RANGE[1] + 1).keys()].map((y) => [y, String(y)])}
    />
  );
}
