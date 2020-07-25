import * as React from "react";
import endOfWeek from "date-fns/endOfWeek";
import startOfWeek from "date-fns/startOfWeek";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mean } from "../../../utils";
import { NormalizedMoods } from "../../../types";

const WEEK_OPTIONS = {
  weekStartsOn: 1,
} as const;

const weekFormatter = Intl.DateTimeFormat(undefined, {
  day: "numeric",
  month: "long",
  year: "numeric",
});

const computeNaiveAverageByWeek = (
  moods: NormalizedMoods
): [string, number][] => {
  const idsGroupedByWeek: { [week: string]: string[] } = {};

  for (const id of moods.allIds) {
    const dateObj = new Date(id);

    // HACK: At some point the types will catch up and we can
    // remove the `any` type assertion below
    const key = (weekFormatter as any).formatRange(
      startOfWeek(dateObj, WEEK_OPTIONS),
      endOfWeek(dateObj, WEEK_OPTIONS)
    );
    if (idsGroupedByWeek[key]) idsGroupedByWeek[key].push(id);
    else idsGroupedByWeek[key] = [id];
  }

  return Object.entries(idsGroupedByWeek).map(([week, ids]) => [
    week,
    mean(ids.map((id) => moods.byId[id].mood)),
  ]);
};

export default function WeeklyAverages() {
  const state = React.useContext(StateContext);
  const averageByWeek = computeNaiveAverageByWeek(state.moods);

  return (
    <Paper>
      <h2>Weekly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Naïve average mood</th>
          </tr>
        </thead>
        <tbody>
          {averageByWeek.reverse().map(([week, averageMood]) => (
            <tr key={week}>
              <td>{week}</td>
              <td>{averageMood.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
