import * as React from "react";
import { Pagination, Paper } from "eri";
import { mapRight, formatIsoYearInLocalTimezone } from "../../../utils";
import MoodCell from "./MoodCell";
import { yearFormatter } from "../../../formatters";
import { Link } from "@reach/router";
import { averageByYearSelector } from "../../../selectors";
import { useSelector } from "react-redux";

const MAX_YEARS_PER_PAGE = 8;

export default function Years() {
  const averageByYear = useSelector(averageByYearSelector);
  const [page, setPage] = React.useState(0);

  const pageCount = Math.ceil(averageByYear.length / MAX_YEARS_PER_PAGE);
  const startIndex = Math.max(
    0,
    averageByYear.length - MAX_YEARS_PER_PAGE * (page + 1)
  );
  const endIndex = averageByYear.length - MAX_YEARS_PER_PAGE * page;

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
            averageByYear.slice(startIndex, endIndex),
            ([year, averageMood]) => {
              const yearString = yearFormatter.format(year);
              return (
                <tr key={yearString}>
                  <td>
                    <Link to={`years/${formatIsoYearInLocalTimezone(year)}`}>
                      {yearString}
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
