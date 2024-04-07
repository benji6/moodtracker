import { Pagination, Paper } from "eri";
import { createDateFromLocalDateString, mapRight } from "../../../utils";
import { Link } from "react-router-dom";
import MoodGradientForPeriod from "../Stats/MoodGradientForPeriod";
import TrackedCategoriesList from "../../shared/TrackedCategoriesList";
import { addDays } from "date-fns";
import { dateWeekdayFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const DAYS_PER_PAGE = 7;

export default function TrackedCategoriesByDay() {
  const dates = Object.keys(
    useSelector(eventsSlice.selectors.allDenormalizedTrackedCategoriesByDate),
  );
  const [page, setPage] = useState(0);

  const pageCount = Math.max(Math.ceil(dates.length / DAYS_PER_PAGE), 1);

  const endIndex = dates.length - page * DAYS_PER_PAGE;

  return (
    <>
      {dates.length ? (
        mapRight(
          dates.slice(Math.max(endIndex - DAYS_PER_PAGE, 0), endIndex),
          (dayStr) => {
            const date = createDateFromLocalDateString(dayStr);
            return (
              <Paper key={dayStr}>
                <h3>
                  <Link to={`/stats/days/${dayStr}`}>
                    {dateWeekdayFormatter.format(date)}
                  </Link>
                </h3>
                <MoodGradientForPeriod
                  dateFrom={date}
                  dateTo={addDays(date, 1)}
                />
                <TrackedCategoriesList
                  isoDateInLocalTimezone={dayStr}
                  reverse
                />
              </Paper>
            );
          },
        )
      ) : (
        <Paper>
          <h3>No results found</h3>
          <p>Try again with a different search</p>
        </Paper>
      )}
      {pageCount > 1 && (
        <Paper>
          <Pagination onChange={setPage} page={page} pageCount={pageCount} />
        </Paper>
      )}
    </>
  );
}
