import { addMonths, eachMonthOfInterval } from "date-fns";
import * as React from "react";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { trapeziumArea, mapRight } from "../../../utils";
import { NormalizedMoods } from "../../../types";
import { MOOD_RANGE } from "../../../constants";
import MoodCell from "./MoodCell";

const monthFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

export const computeAverageByMonth = (
  moods: NormalizedMoods
): [string, number][] => {
  const averageByMonth: [string, number][] = [];

  const months = eachMonthOfInterval({
    start: new Date(moods.allIds[0]),
    end: new Date(moods.allIds[moods.allIds.length - 1]),
  });

  const finalMonth = addMonths(months[months.length - 1], 1);

  if (moods.allIds.length === 1) {
    return [
      [monthFormatter.format(months[0]), moods.byId[moods.allIds[0]].mood],
    ];
  }

  months.push(finalMonth);

  const earliestMoodTime = new Date(moods.allIds[0]).getTime();
  const latestMoodTime = new Date(
    moods.allIds[moods.allIds.length - 1]
  ).getTime();

  for (let i = 1; i < months.length; i++) {
    const month0 = months[i - 1];
    const month1 = months[i];

    const m0 = month0.getTime();
    const m1 = month1.getTime();

    const maxArea =
      (Math.min(m1, latestMoodTime) - Math.max(m0, earliestMoodTime)) *
      (MOOD_RANGE[1] - MOOD_RANGE[0]);

    // `startIndex` is the last mood before the current month
    // or the first mood if it's the first month
    let startIndex = 0;
    if (i > 1) {
      for (let j = 1; j < moods.allIds.length; j++) {
        const moodTime = new Date(moods.allIds[j]).getTime();
        if (moodTime > m0) {
          startIndex = j - 1;
          break;
        }
      }
    }

    // `endIndex` is the first mood after the current month
    // or the last mood if it's the last month
    let endIndex = moods.allIds.length - 1;
    if (i < months.length - 1) {
      for (let j = startIndex; j < moods.allIds.length; j++) {
        const moodTime = new Date(moods.allIds[j]).getTime();
        if (moodTime > m1) {
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

      if (t0 < m0 && t1 > m1) {
        area += trapeziumArea(
          mood0 + ((mood1 - mood0) * (m0 - t0)) / (t1 - t0),
          mood0 + ((mood1 - mood0) * (m1 - t0)) / (t1 - t0),
          m1 - m0
        );
        continue;
      }

      if (t0 < m0) {
        area += trapeziumArea(
          mood1 + ((mood0 - mood1) * (t1 - m0)) / (t1 - t0),
          mood1,
          t1 - m0
        );
        continue;
      }

      if (t1 > m1) {
        area += trapeziumArea(
          mood0,
          mood0 + ((mood1 - mood0) * (m1 - t0)) / (t1 - t0),
          m1 - t0
        );
        break;
      }

      area += trapeziumArea(mood0, mood1, t1 - t0);
    }

    averageByMonth.push([
      monthFormatter.format(month0),
      (area / maxArea) * MOOD_RANGE[1],
    ]);
  }

  return averageByMonth;
};

export default function MonthlyAverages() {
  const state = React.useContext(StateContext);
  const averageByMonth = React.useMemo(
    () => computeAverageByMonth(state.moods),
    [state.moods]
  );

  return (
    <Paper>
      <h2>Monthly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(averageByMonth, ([month, averageMood]) => (
            <tr key={month}>
              <td>{month}</td>
              <MoodCell mood={averageMood} />
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
