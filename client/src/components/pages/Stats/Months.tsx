import * as React from "react";
import { Pagination, Paper } from "eri";
import { mapRight, formatIsoMonthInLocalTimezone } from "../../../utils";
import MoodCell from "./MoodCell";
import { monthFormatter } from "../../../formatters";
import { Link } from "@reach/router";
import { averageByMonthSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const MAX_MONTHS_PER_PAGE = 12;

export default function Months() {
  const averageByMonth = useSelector(averageByMonthSelector);
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(averageByMonth.length / MAX_MONTHS_PER_PAGE);
  const startIndex = Math.max(
    0,
    averageByMonth.length - MAX_MONTHS_PER_PAGE * (page + 1)
  );
  const endIndex = averageByMonth.length - MAX_MONTHS_PER_PAGE * page;

  return (
    <Paper>
      <h2>Months</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(
            averageByMonth.slice(startIndex, endIndex),
            ([month, averageMood]) => {
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
            }
          )}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
