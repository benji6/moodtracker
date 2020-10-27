import { addMonths, eachMonthOfInterval } from "date-fns";
import * as React from "react";
import { Paper } from "eri";
import {
  mapRight,
  computeAverageMoodInInterval,
  formatIsoMonthInLocalTimezone,
} from "../../../utils";
import { NormalizedMoods } from "../../../types";
import MoodCell from "./MoodCell";
import { monthFormatter } from "../../../formatters";
import { Link } from "@reach/router";
import { moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

export const computeAverageByMonth = (
  moods: NormalizedMoods
): [Date, number][] => {
  const averageByMonth: [Date, number][] = [];

  const months = eachMonthOfInterval({
    start: new Date(moods.allIds[0]),
    end: new Date(moods.allIds[moods.allIds.length - 1]),
  });

  const finalMonth = addMonths(months[months.length - 1], 1);

  if (moods.allIds.length === 1) {
    return [[months[0], moods.byId[moods.allIds[0]].mood]];
  }

  months.push(finalMonth);

  for (let i = 1; i < months.length; i++) {
    const month0 = months[i - 1];
    const month1 = months[i];

    averageByMonth.push([
      month0,
      computeAverageMoodInInterval(moods, month0, month1),
    ]);
  }

  return averageByMonth;
};

export default function MonthlyAverages() {
  const moods = useSelector(moodsSelector);
  const averageByMonth = React.useMemo(() => computeAverageByMonth(moods), [
    moods,
  ]);

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
          {mapRight(averageByMonth, ([month, averageMood]) => {
            const monthStr = monthFormatter.format(month);
            return (
              <tr key={monthStr}>
                <td>
                  <Link to={`months/${formatIsoMonthInLocalTimezone(month)}`}>
                    {monthStr}
                  </Link>
                </td>
                <MoodCell mood={averageMood} />
              </tr>
            );
          })}
        </tbody>
      </table>
    </Paper>
  );
}
