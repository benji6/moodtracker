import "./style.css";
import { Button, Card, Icon, Pagination, Paper } from "eri";
import { Link, useNavigate } from "react-router-dom";
import { createDateFromLocalDateString, mapRight } from "../../../../utils";
import MoodCard from "../../../shared/MoodCard";
import MoodGradientForPeriod from "../../Stats/MoodGradientForPeriod";
import { TEST_IDS } from "../../../../constants";
import { addDays } from "date-fns";
import { dateWeekdayFormatter } from "../../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { useState } from "react";

const DAYS_PER_PAGE = 7;

export default function MoodList() {
  const navigate = useNavigate();
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
      <Paper data-test-id={TEST_IDS.moodList}>
        <h2>Home</h2>
        <div className="mood-list__add-links">
          <Button onClick={() => navigate("/add")}>
            <Icon margin="end" name="heart" />
            Add mood
          </Button>
          <Button onClick={() => navigate("/sleep/add")}>
            <Icon margin="end" name="moon" />
            Add sleep
          </Button>
          <Button onClick={() => navigate("/weight/add")}>
            <Icon margin="end" name="weight" />
            Add weight
          </Button>
          <Button onClick={() => navigate("/meditation")}>
            <Icon margin="end" name="bell" />
            Meditate
          </Button>
        </div>
      </Paper>
      {moodsGroupedByDay.length ? (
        mapRight(
          moodsGroupedByDay.slice(
            Math.max(endIndex - DAYS_PER_PAGE, 0),
            endIndex,
          ),
          ([dayStr, ids]) => {
            const day = createDateFromLocalDateString(dayStr);
            return (
              <Paper key={dayStr}>
                <h3>
                  <Link to={`/stats/days/${dayStr}`}>
                    {dateWeekdayFormatter.format(day)}
                  </Link>
                </h3>
                <MoodGradientForPeriod
                  dateFrom={day}
                  dateTo={addDays(day, 1)}
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
