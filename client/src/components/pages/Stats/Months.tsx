import * as React from "react";
import { Pagination, Paper } from "eri";
import {
  mapRight,
  formatIsoMonthInLocalTimezone,
  createDateFromLocalDateString,
} from "../../../utils";
import MoodCell from "../../shared/MoodCell";
import { monthYearFormatter } from "../../../dateTimeFormatters";
import { Link } from "@reach/router";
import { normalizedAveragesByMonthSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import addMonths from "date-fns/addMonths";

const MAX_MONTHS_PER_PAGE = 12;

export default function Months() {
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector
  );
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(
    normalizedAveragesByMonth.allIds.length / MAX_MONTHS_PER_PAGE
  );
  const endIndex =
    normalizedAveragesByMonth.allIds.length - MAX_MONTHS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_MONTHS_PER_PAGE);

  return (
    <Paper>
      <h2>Months</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Mood gradient</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(
            normalizedAveragesByMonth.allIds.slice(startIndex, endIndex),
            (dateString) => {
              const month = createDateFromLocalDateString(dateString);
              const monthStr = monthYearFormatter.format(month);
              return (
                <tr key={monthStr}>
                  <td>
                    <Link to={`months/${formatIsoMonthInLocalTimezone(month)}`}>
                      {monthStr}
                    </Link>
                  </td>
                  <td>
                    <MoodGradientForPeriod
                      fromDate={month}
                      toDate={addMonths(month, 1)}
                    />
                  </td>
                  <MoodCell
                    mood={normalizedAveragesByMonth.byId[dateString]!}
                  />
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
