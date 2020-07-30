import * as React from "react";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mean } from "../../../utils";
import { NormalizedMoods } from "../../../types";

const monthFormatter = Intl.DateTimeFormat(undefined, {
  month: "long",
  year: "numeric",
});

const computeNaiveAverageByMonth = (
  moods: NormalizedMoods
): [string, number][] => {
  const idsGroupedByMonth: { [month: string]: string[] } = {};

  for (const id of moods.allIds) {
    const dateObj = new Date(id);
    const key = monthFormatter.format(dateObj);
    if (idsGroupedByMonth[key]) idsGroupedByMonth[key].push(id);
    else idsGroupedByMonth[key] = [id];
  }

  return Object.entries(idsGroupedByMonth).map(([month, ids]) => [
    month,
    mean(ids.map((id) => moods.byId[id].mood)),
  ]);
};

export default function MonthlyAverages() {
  const state = React.useContext(StateContext);
  const naiveAverageByMonth = computeNaiveAverageByMonth(state.moods);

  return (
    <Paper>
      <h2>Monthly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Average mood</th>
            <th>Naïve average mood</th>
          </tr>
        </thead>
        <tbody>
          {naiveAverageByMonth.reverse().map(([month, averageMood]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>N/A</td>
              <td>{averageMood.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
