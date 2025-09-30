import { Icon, Pagination, Paper } from "eri";
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

type SortColumn = "year" | "mood";
type SortDirection = "asc" | "desc";

export default function Years() {
  const meanMoodsByYear = useSelector(eventsSlice.selectors.meanMoodsByYear);
  const [page, setPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<SortColumn>("year");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (column: SortColumn) => {
    setPage(0);
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      return;
    }
    setSortColumn(column);
    setSortDirection("asc");
  };

  const years = Object.keys(meanMoodsByYear).sort((a, b) => {
    let comparison = 0;
    if (sortColumn === "year") comparison = a.localeCompare(b);
    else comparison = meanMoodsByYear[a] - meanMoodsByYear[b];
    return sortDirection === "asc" ? -comparison : comparison;
  });

  const pageCount = Math.ceil(years.length / MAX_YEARS_PER_PAGE);
  const endIndex = years.length - MAX_YEARS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_YEARS_PER_PAGE);

  const getSortIcon = (column: SortColumn) => (
    <Icon
      margin="start"
      name={
        sortColumn === column
          ? sortDirection === "asc"
            ? "up"
            : "down"
          : "sortable"
      }
    />
  );

  return (
    <Paper>
      <h2>Years</h2>
      <table>
        <thead>
          <tr>
            <th>
              <button
                onClick={() => handleSort("year")}
                style={{ fontWeight: "inherit" }}
              >
                Year{getSortIcon("year")}
              </button>
            </th>
            <th>Mood gradient</th>
            <th>
              <button
                onClick={() => handleSort("mood")}
                style={{ fontWeight: "inherit" }}
              >
                Average mood{getSortIcon("mood")}
              </button>
            </th>
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
