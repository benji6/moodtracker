import { Card, Pagination, Paper, Spinner } from "eri";
import { Navigate } from "react-router";
import { parseAsString, useQueryStates } from "nuqs";
import { useSelector } from "react-redux";
import EVENT_TYPE_TO_LABELS from "../../../constants/eventTypeToLabels";
import { dateWeekdayFormatter } from "../../../formatters/dateTimeFormatters";
import { paginateEventDays, parseEventLogRange } from "../../../eventLog";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone, roundDateDown } from "../../../utils";
import DateRangeSelector from "../../shared/DateRangeSelector";

export default function Events() {
  const [query, setQuery] = useQueryStates(
    {
      dateFrom: parseAsString,
      dateTo: parseAsString,
      page: parseAsString,
    },
    { history: "push" },
  );
  const { dateFrom, dateTo, isValid } = parseEventLogRange(
    query.dateFrom,
    query.dateTo,
  );
  const allEvents = useSelector(
    eventsSlice.selectors.allTrackedEventsOrderedByDate,
  );
  const events = useSelector((state: RootState) =>
    eventsSlice.selectors.trackedEventsInPeriod(state, dateFrom, dateTo),
  );
  const isSyncing = useSelector(eventsSlice.selectors.isSyncingFromServer);
  const hasLoaded = useSelector(eventsSlice.selectors.hasLoadedFromServer);
  const pagination = paginateEventDays(events, query.page);

  if (!isValid) return <Navigate replace to="/events" />;
  if (!hasLoaded && isSyncing && !allEvents.length) return <Spinner />;
  if (query.page !== null && query.page !== String(pagination.page)) {
    const params = new URLSearchParams();
    if (query.dateFrom !== null) params.set("dateFrom", query.dateFrom);
    if (query.dateTo !== null) params.set("dateTo", query.dateTo);
    if (pagination.page > 1) params.set("page", String(pagination.page));
    return <Navigate replace to={`/events?${params}`} />;
  }

  const today = roundDateDown(new Date());
  const firstDate = allEvents[0]?.date ?? today;
  const displayDateFrom =
    dateFrom ?? (dateTo && dateTo < firstDate ? dateTo : firstDate);
  const displayDateTo =
    dateTo ?? (displayDateFrom > today ? displayDateFrom : today);

  return (
    <Paper.Group>
      <Paper>
        <h2>Event log</h2>
        <p>View, edit or delete your logged events.</p>
        <DateRangeSelector
          dateFrom={displayDateFrom}
          dateTo={displayDateTo}
          minDate={null}
          maxDate={null}
          setDateFrom={(date) =>
            setQuery({
              dateFrom: formatIsoDateInLocalTimezone(date),
              page: null,
            })
          }
          setDateTo={(date) =>
            setQuery({
              dateTo: formatIsoDateInLocalTimezone(date),
              page: null,
            })
          }
        />
      </Paper>
      {pagination.days.length ? (
        pagination.days.map(([day, dayEvents]) => (
          <Paper key={day}>
            <h3>{dateWeekdayFormatter.format(dayEvents[0].date)}</h3>
            <Card.Group>
              {dayEvents.map(({ id, type }) => {
                const { CardComponent } = EVENT_TYPE_TO_LABELS[type];
                return <CardComponent key={id} id={id} />;
              })}
            </Card.Group>
          </Paper>
        ))
      ) : (
        <Paper>
          <h3>No events found</h3>
          <p>Choose a different date range to review other events.</p>
        </Paper>
      )}
      {pagination.pageCount > 1 && (
        <Paper>
          <Pagination
            page={pagination.page - 1}
            pageCount={pagination.pageCount}
            onChange={(page) =>
              setQuery({ page: page ? String(page + 1) : null })
            }
          />
        </Paper>
      )}
    </Paper.Group>
  );
}
