import "./style.css";
import { Card, Pagination, Paper } from "eri";
import { createDateFromLocalDateString, mapRight } from "../../../../utils";
import { Link } from "react-router-dom";
import MoodCard from "../../../shared/MoodCard";
import MoodGradientForPeriod from "../../Stats/MoodGradientForPeriod";
import { addDays } from "date-fns";
import { dateWeekdayFormatter } from "../../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const DAYS_PER_PAGE = 7;

export default function MoodList() {
  const moodsGroupedByDay = Object.entries(
    useSelector(eventsSlice.selectors.moodIdsByDate),
  );
  const [page, setPage] = useState(0);

  const pageCount = Math.max(
    Math.ceil(moodsGroupedByDay.length / DAYS_PER_PAGE),
    1,
  );

  const endIndex = moodsGroupedByDay.length - page * DAYS_PER_PAGE;

  return (
    <>
      {moodsGroupedByDay.length ? (
        mapRight(
          moodsGroupedByDay.slice(
            Math.max(endIndex - DAYS_PER_PAGE, 0),
            endIndex,
          ),
          ([dayStr, ids]) => {
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
                <Card.Group>
                  {mapRight(ids!, (id) => (
                    <MoodCard id={id} key={id} />
                  ))}
                </Card.Group>
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
