import { Pagination, Paper } from "eri";
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

export default function Months() {
  const meanMoodByMonth = useSelector(eventsSlice.selectors.meanMoodsByMonth);
  const months = Object.keys(meanMoodByMonth);
  const [page, setPage] = useState(0);

  const pageCount = Math.ceil(months.length / MAX_MONTHS_PER_PAGE);
  const endIndex = months.length - MAX_MONTHS_PER_PAGE * page;
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
