import { Pagination, Paper } from "eri";
import {
  createDateFromLocalDateString,
  formatIsoYearInLocalTimezone,
  mapRight,
} from "../../../utils";
import { Link } from "react-router";
import MoodCell from "../../shared/MoodCell";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { addYears } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";
import { yearFormatter } from "../../../formatters/dateTimeFormatters";

const MAX_YEARS_PER_PAGE = 8;

export default function Years() {
  const meanMoodsByYear = useSelector(eventsSlice.selectors.meanMoodsByYear);
  const years = Object.keys(meanMoodsByYear);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(years.length / MAX_YEARS_PER_PAGE);
  const endIndex = years.length - MAX_YEARS_PER_PAGE * page;
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
          {mapRight(years.slice(startIndex, endIndex), (dateString) => {
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
                <MoodCell mood={meanMoodsByYear[dateString]} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
