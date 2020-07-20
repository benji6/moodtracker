import * as React from "react";
import { Paper } from "eri";
import { StateContext } from "../../AppState";

const average = (xs: number[]): number =>
  xs.reduce((a, b) => a + b) / xs.length;

export default function MonthlyAverages() {
  const state = React.useContext(StateContext);
  const idsGroupedByMonth: { [month: string]: string[] } = {};

  for (const id of state.moods.allIds) {
    const dateObj = new Date(id);
    const key = `${dateObj.getFullYear()}-${dateObj.getMonth() + 1}`;
    if (idsGroupedByMonth[key]) idsGroupedByMonth[key].push(id);
    else idsGroupedByMonth[key] = [id];
  }

  const averageByMonth: [string, number][] = Object.entries(
    idsGroupedByMonth
  ).map(([month, ids]) => {
    const moods = ids.map((id) => state.moods.byId[id].mood);
    return [month, average(moods)];
  });

  return (
    <Paper>
      <h2>Monthly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Year-Month</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {averageByMonth.map(([month, averageMood]) => (
            <tr key={month}>
              <td>{month}</td>
              <td>{averageMood.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </Paper>
  );
}
