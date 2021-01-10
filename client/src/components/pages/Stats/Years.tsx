import * as React from "react";
import { Pagination, Paper } from "eri";
import {
  mapRight,
  formatIsoYearInLocalTimezone,
  createDateFromLocalDateString,
} from "../../../utils";
import MoodCell from "./MoodCell";
import { yearFormatter } from "../../../formatters";
import { Link } from "@reach/router";
import { normalizedAveragesByYearSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const MAX_YEARS_PER_PAGE = 8;

export default function Years() {
  const normalizedAveragesByYear = useSelector(
    normalizedAveragesByYearSelector
  );
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(
    normalizedAveragesByYear.allIds.length / MAX_YEARS_PER_PAGE
  );
  const startIndex = Math.max(
    0,
    normalizedAveragesByYear.allIds.length - MAX_YEARS_PER_PAGE * (page + 1)
  );
  const endIndex =
    normalizedAveragesByYear.allIds.length - MAX_YEARS_PER_PAGE * page;

  return (
    <Paper>
      <h2>Years</h2>
      <table>
        <thead>
          <tr>
            <th>Year</th>
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
                  <MoodCell mood={normalizedAveragesByYear.byId[dateString]} />
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
