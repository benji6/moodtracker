import * as React from "react";
import getISOWeek from "date-fns/getISOWeek";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mean } from "../../../utils";

export default function WeeklyAverages() {
  const state = React.useContext(StateContext);
  const idsGroupedByWeek: { [week: string]: string[] } = {};

  for (const id of state.moods.allIds) {
    const dateObj = new Date(id);
    const week = getISOWeek(dateObj);
    const key = `${dateObj.getFullYear()}-W${String(week).padStart(2, "0")}`;
    if (idsGroupedByWeek[key]) idsGroupedByWeek[key].push(id);
    else idsGroupedByWeek[key] = [id];
  }

  const averageByWeek: [string, number][] = Object.entries(
    idsGroupedByWeek
  ).map(([week, ids]) => [
    week,
    mean(ids.map((id) => state.moods.byId[id].mood)),
  ]);

  return (
    <Paper>
      <h2>Weekly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Year-Week</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {averageByWeek.map(([week, averageMood]) => (
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
