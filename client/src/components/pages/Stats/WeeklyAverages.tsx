import * as React from "react";
import addWeeks from "date-fns/addWeeks";
import eachWeekOfInterval from "date-fns/eachWeekOfInterval";
import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mean, trapeziumArea } from "../../../utils";
import { NormalizedMoods } from "../../../types";
import { MOOD_RANGE } from "../../../constants";

const WEEK_OPTIONS = {
  weekStartsOn: 1,
} as const;

const weekFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

// TODO: One day we should be able to remove this
const formatRange = (dateA: Date, dateB: Date) =>
  "formatRange" in weekFormatter
    ? (weekFormatter as any).formatRange(dateA, dateB)
    : `${weekFormatter.format(dateA)} – ${weekFormatter.format(dateB)}`;

const createKey = (week: Date): string =>
  formatRange(startOfWeek(week, WEEK_OPTIONS), endOfWeek(week, WEEK_OPTIONS));

const computeNaiveAverageByWeek = (
  moods: NormalizedMoods
): [string, number][] => {
  const idsGroupedByWeek: { [week: string]: string[] } = {};

  for (const id of moods.allIds) {
    const dateObj = new Date(id);
    const key = createKey(dateObj);
    if (idsGroupedByWeek[key]) idsGroupedByWeek[key].push(id);
    else idsGroupedByWeek[key] = [id];
  }

  return Object.entries(idsGroupedByWeek).map(([week, ids]) => [
    week,
    mean(ids.map((id) => moods.byId[id].mood)),
  ]);
};

export const computeAverageByWeek = (
  moods: NormalizedMoods
): { [week: string]: number } => {
  const averageByWeek: { [week: string]: number } = {};

  const weeks = eachWeekOfInterval({
    start: new Date(moods.allIds[0]),
    end: new Date(moods.allIds[moods.allIds.length - 1]),
  });

  const finalWeek = addWeeks(weeks[weeks.length - 1], 1);

  if (moods.allIds.length === 1) {
    return {
      [createKey(finalWeek)]: moods.byId[moods.allIds[0]].mood,
    };
  }

  weeks.push(finalWeek);

  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1]
  ).getTime();

  for (let i = 1; i < weeks.length; i++) {
    const week0 = weeks[i - 1];
    const week1 = weeks[i];

    const w0 = week0.getTime();
    const w1 = week1.getTime();

    const maxArea =
      (Math.min(w1, latestMoodTime) - Math.max(w0, earliestMoodTime)) *
      (MOOD_RANGE[1] - MOOD_RANGE[0]);

    // `startIndex` is the last mood before the current week
    // or the first mood if it's the first week
    let startIndex = 0;
    if (i > 1) {
      for (let j = 1; j < moods.allIds.length; j++) {
        const moodTime = new Date(moods.allIds[j]).getTime();
        if (moodTime > w0) {
          startIndex = j - 1;
          break;
        }
      }
    }

    // `endIndex` is the first mood after the current week
    // or the last mood if it's the last week
    let endIndex = moods.allIds.length - 1;
    if (i < weeks.length - 1) {
      for (let j = startIndex; j < moods.allIds.length; j++) {
        const moodTime = new Date(moods.allIds[j]).getTime();
        if (moodTime > w1) {
          endIndex = j;
          break;
        }
      }
    }

    let area = 0;

    for (let j = startIndex + 1; j <= endIndex; j++) {
      const id0 = moods.allIds[j - 1];
      const t0 = new Date(id0).getTime();
      const mood0 = moods.byId[id0].mood;

      const id1 = moods.allIds[j];
      const t1 = new Date(id1).getTime();
      const mood1 = moods.byId[id1].mood;

      if (t0 < w0 && t1 > w1) {
        area += trapeziumArea(
          mood1 + ((mood0 - mood1) * (w1 - w0)) / (t1 - t0),
          mood0 + ((mood1 - mood0) * (w1 - w0)) / (t1 - t0),
          w1 - w0
        );
        continue;
      }

      if (t0 < w0) {
        area += trapeziumArea(
          mood1 + ((mood0 - mood1) * (t1 - w0)) / (t1 - t0),
          mood1,
          t1 - w0
        );
        continue;
      }

      if (t1 > w1) {
        area += trapeziumArea(
          mood0,
          mood0 + ((mood1 - mood0) * (w1 - t0)) / (t1 - t0),
          w1 - t0
        );
        break;
      }

      area += trapeziumArea(mood0, mood1, t1 - t0);
    }

    averageByWeek[createKey(week1)] = (area / maxArea) * MOOD_RANGE[1];
  }

  return averageByWeek;
};

export default function WeeklyAverages() {
  const state = React.useContext(StateContext);
  const naiveAverageByWeek = computeNaiveAverageByWeek(state.moods);
  const averageByWeek = computeAverageByWeek(state.moods);

  return (
    <Paper>
      <h2>Weekly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Average mood</th>
            <th>Naïve average mood</th>
          </tr>
        </thead>
        <tbody>
          {naiveAverageByWeek.reverse().map(([week, averageMood]) => (
            <tr key={week}>
              <td>{week}</td>
              <td>{averageByWeek[week].toFixed(2)}</td>
              <td>{averageMood.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
