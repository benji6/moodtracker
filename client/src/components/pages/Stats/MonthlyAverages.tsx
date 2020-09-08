import { addMonths, eachMonthOfInterval } from "date-fns";
import * as React from "react";
import { Paper } from "eri";
import { StateContext } from "../../AppState";
import { mapRight, computeAverageMoodInInterval } from "../../../utils";
import { NormalizedMoods } from "../../../types";
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

  for (let i = 1; i < months.length; i++) {
    const month0 = months[i - 1];
    const month1 = months[i];

    averageByMonth.push([
      monthFormatter.format(month0),
      computeAverageMoodInInterval(moods, month0, month1),
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
