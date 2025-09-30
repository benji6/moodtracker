import { Icon, Pagination, Paper } from "eri";
import {
  WEEK_OPTIONS,
  formatWeekWithYear,
} from "../../../formatters/dateTimeFormatters";
import { addWeeks, startOfWeek } from "date-fns";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  mapRight,
} from "../../../utils";
import { Link } from "react-router";
import MoodCell from "../../shared/MoodCell";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_WEEKS_PER_PAGE = 8;

type SortColumn = "week" | "mood";
type SortDirection = "asc" | "desc";

export default function Weeks() {
  const meanMoodsByWeek = useSelector(eventsSlice.selectors.meanMoodsByWeek);
  const [page, setPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<SortColumn>("week");
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

  const weeks = Object.keys(meanMoodsByWeek).sort((a, b) => {
    let comparison = 0;
    if (sortColumn === "week") comparison = a.localeCompare(b);
    else comparison = meanMoodsByWeek[a] - meanMoodsByWeek[b];
    return sortDirection === "asc" ? -comparison : comparison;
  });

  const pageCount = Math.ceil(weeks.length / MAX_WEEKS_PER_PAGE);
  const endIndex = weeks.length - MAX_WEEKS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_WEEKS_PER_PAGE);

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
      <h2>Weeks</h2>
      <table>
        <thead>
          <tr>
            <th>
              <button
                onClick={() => handleSort("week")}
                style={{ fontWeight: "inherit" }}
              >
                Week{getSortIcon("week")}
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
          {mapRight(weeks.slice(startIndex, endIndex), (dateString) => {
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
                <MoodCell mood={meanMoodsByWeek[dateString]} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
