import { Icon, Pagination, Paper } from "eri";
import {
  createDateFromLocalDateString,
  formatIsoMonthInLocalTimezone,
  mapRight,
} from "../../../utils";
import { Link } from "react-router";
import MoodCell from "../../shared/MoodCell";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import { addMonths } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";
import { monthYearFormatter } from "../../../formatters/dateTimeFormatters";
import { useSelector } from "react-redux";
import { useState } from "react";

const MAX_MONTHS_PER_PAGE = 12;

type SortColumn = "month" | "mood";
type SortDirection = "asc" | "desc";

export default function Months() {
  const meanMoodByMonth = useSelector(eventsSlice.selectors.meanMoodsByMonth);
  const [page, setPage] = useState(0);
  const [sortColumn, setSortColumn] = useState<SortColumn>("month");
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

  const months = Object.keys(meanMoodByMonth).sort((a, b) => {
    let comparison = 0;
    if (sortColumn === "month") comparison = a.localeCompare(b);
    else comparison = meanMoodByMonth[a] - meanMoodByMonth[b];
    return sortDirection === "asc" ? -comparison : comparison;
  });

  const pageCount = Math.ceil(months.length / MAX_MONTHS_PER_PAGE);
  const endIndex = months.length - MAX_MONTHS_PER_PAGE * page;
  const startIndex = Math.max(0, endIndex - MAX_MONTHS_PER_PAGE);

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
      <h2>Months</h2>
      <table>
        <thead>
          <tr>
            <th>
              <button
                onClick={() => handleSort("month")}
                style={{ fontWeight: "inherit" }}
              >
                Month{getSortIcon("month")}
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
          {mapRight(months.slice(startIndex, endIndex), (dateString) => {
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
                    dateFrom={month}
                    dateTo={addMonths(month, 1)}
                  />
                </td>
                <MoodCell mood={meanMoodByMonth[dateString]} />
              </tr>
            );
          })}
        </tbody>
      </table>
      <Pagination onChange={setPage} page={page} pageCount={pageCount} />
    </Paper>
  );
}
