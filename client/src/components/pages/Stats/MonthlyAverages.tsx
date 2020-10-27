import * as React from "react";
import { Paper } from "eri";
import { mapRight, formatIsoMonthInLocalTimezone } from "../../../utils";
import MoodCell from "./MoodCell";
import { monthFormatter } from "../../../formatters";
import { Link } from "@reach/router";
import { averageByMonthSelector } from "../../../selectors";
import { useSelector } from "react-redux";

export default function MonthlyAverages() {
  const averageByMonth = useSelector(averageByMonthSelector);

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
