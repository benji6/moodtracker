import * as React from "react";
import { Pagination, Paper } from "eri";
import {
  mapRight,
  formatIsoDateInLocalTimezone,
  createDateFromLocalDateString,
} from "../../../utils";
import MoodCell from "../../shared/MoodCell";
import {
  formatWeekWithYear,
  WEEK_OPTIONS,
} from "../../../formatters/dateTimeFormatters";
import { useSelector } from "react-redux";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { Link } from "react-router-dom";
import { addWeeks, startOfWeek } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";

const MAX_WEEKS_PER_PAGE = 8;

export default function Weeks() {
  const normalizedAveragesByWeek = useSelector(
    eventsSlice.selectors.normalizedAveragesByWeek,
  );
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(
    normalizedAveragesByWeek.allIds.length / MAX_WEEKS_PER_PAGE,
  );
  const endIndex =
    normalizedAveragesByWeek.allIds.length - MAX_WEEKS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_WEEKS_PER_PAGE);

  return (
    <Paper>
      <h2>Weeks</h2>
      <table>
        <thead>
          <tr>
            <th>Week</th>
            <th>Mood gradient</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(
            normalizedAveragesByWeek.allIds.slice(startIndex, endIndex),
            (dateString) => {
              const week = createDateFromLocalDateString(dateString);
              const weekFormattedString = formatWeekWithYear(week);
              return (
                <tr key={weekFormattedString}>
                  <td>
                    <Link
                      to={`weeks/${formatIsoDateInLocalTimezone(
                        startOfWeek(week, WEEK_OPTIONS),
                      )}`}
                    >
                      {weekFormattedString}
                    </Link>
                  </td>
                  <td>
                    <MoodGradientForPeriod
                      dateFrom={week}
                      dateTo={addWeeks(week, 1)}
                    />
                  </td>
                  <MoodCell mood={normalizedAveragesByWeek.byId[dateString]!} />
                </tr>
              );
            },
          )}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
