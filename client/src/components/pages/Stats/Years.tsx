import * as React from "react";
import { Pagination, Paper } from "eri";
import {
  createDateFromLocalDateString,
  formatIsoYearInLocalTimezone,
  mapRight,
} from "../../../utils";
import { Link } from "react-router-dom";
import MoodCell from "../../shared/MoodCell";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { addYears } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { yearFormatter } from "../../../formatters/dateTimeFormatters";

const MAX_YEARS_PER_PAGE = 8;

export default function Years() {
  const normalizedAveragesByYear = useSelector(
    eventsSlice.selectors.normalizedAveragesByYear,
  );
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(
    normalizedAveragesByYear.allIds.length / MAX_YEARS_PER_PAGE,
  );
  const endIndex =
    normalizedAveragesByYear.allIds.length - MAX_YEARS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_YEARS_PER_PAGE);

  return (
    <Paper>
      <h2>Years</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
            <th>Mood gradient</th>
            <th>Average mood</th>
          </tr>
        </thead>
        <tbody>
          {mapRight(
            normalizedAveragesByYear.allIds.slice(startIndex, endIndex),
            (dateString) => {
              const year = createDateFromLocalDateString(dateString);
              const yearFormattedString = yearFormatter.format(year);
              return (
                <tr key={yearFormattedString}>
                  <td>
                    <Link to={`years/${formatIsoYearInLocalTimezone(year)}`}>
                      {yearFormattedString}
                    </Link>
                  </td>
                  <td>
                    <MoodGradientForPeriod
                      dateFrom={year}
                      dateTo={addYears(year, 1)}
                    />
                  </td>
                  <MoodCell mood={normalizedAveragesByYear.byId[dateString]!} />
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
