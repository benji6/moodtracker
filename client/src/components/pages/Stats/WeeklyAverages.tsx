import { startOfWeek } from "date-fns";
import * as React from "react";
import { Pagination, Paper } from "eri";
import { mapRight, formatIsoDateInLocalTimezone } from "../../../utils";
import MoodCell from "./MoodCell";
import { Link } from "@reach/router";
import { formatWeek, WEEK_OPTIONS } from "../../../formatters";
import { averageByWeekSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const MAX_WEEKS_PER_PAGE = 8;

export default function WeeklyAverages() {
  const averageByWeek = useSelector(averageByWeekSelector);
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(averageByWeek.length / MAX_WEEKS_PER_PAGE);
  const startIndex = Math.max(
    0,
    averageByWeek.length - MAX_WEEKS_PER_PAGE * (page + 1)
  );
  const endIndex = averageByWeek.length - MAX_WEEKS_PER_PAGE * page;

  return (
    <Paper>
      <h2>Weekly averages</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(
            averageByWeek.slice(startIndex, endIndex),
            ([week, averageMood]) => {
              const weekStr = formatWeek(week);
              return (
                <tr key={weekStr}>
                  <td>
                    <Link
                      to={`weeks/${formatIsoDateInLocalTimezone(
                        startOfWeek(week, WEEK_OPTIONS)
                      )}`}
                    >
                      {weekStr}
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
