import { Icon, Paper, Spinner, SubHeading } from "eri";
import { useSelector } from "react-redux";
import {
  dayMonthFormatter,
  formatWeekWithYear,
  monthLongFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../dateTimeFormatters";
import {
  normalizedAveragesByWeekSelector,
  eventsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getIdsInInterval,
} from "../../../utils";
import GetStartedCta from "../../shared/GetStartedCta";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForMonth from "./MoodSummaryForMonth";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "./MoodCalendarForMonth";
import subMonths from "date-fns/subMonths";
import addMonths from "date-fns/addMonths";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import addWeeks from "date-fns/addWeeks";
import MoodCell from "../../shared/MoodCell";
import startOfWeek from "date-fns/startOfWeek";
import subDays from "date-fns/subDays";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import PrevNextControls from "../../shared/PrevNextControls";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import LocationsForPeriod from "./LocationsForPeriod";
import RedirectHome from "../../RedirectHome";
import { Link, useParams } from "react-router-dom";
import MoodCloud from "./MoodCloud";

const X_LABELS_COUNT = 5;

const isoMonthRegex = /^\d{4}-\d{2}$/;

export default function Month() {
  const { month: monthStr } = useParams();
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const normalizedAveragesByWeek = useSelector(
    normalizedAveragesByWeekSelector
  );

  if (!monthStr || !isoMonthRegex.test(monthStr)) return <RedirectHome />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);

  const date = createDateFromLocalDateString(monthStr);
  const prevDate = subMonths(date, 1);
  const nextDate = addMonths(date, 1);
  const nextMonthDateString = formatIsoDateInLocalTimezone(nextDate);
  const monthMinus7DaysDateString = formatIsoDateInLocalTimezone(
    subDays(date, 7)
  );

  const showPrevious = date > firstMoodDate;
  const showNext = nextDate <= new Date();

  const moodIdsInMonth = getIdsInInterval(moods.allIds, date, nextDate);

  const monthLength = differenceInCalendarDays(nextDate, date);

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const d = addDays(
      date,
      Math.round((i * monthLength) / (X_LABELS_COUNT - 1))
    );
    xLabels.push([d.getTime(), dayMonthFormatter.format(d)]);
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {monthLongFormatter.format(date)}
          <SubHeading>
            <Link to={`../../years/${formatIsoYearInLocalTimezone(date)}`}>
              {yearFormatter.format(date)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod fromDate={date} toDate={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              {monthLongFormatter.format(prevDate)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextDate)}`}>
              {monthLongFormatter.format(nextDate)}
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForMonth dates={[prevDate, date, nextDate]} />
      {moodIdsInMonth.length ? (
        <>
          <Paper>
            <h3>Mood chart</h3>
            <MoodChartForPeriod
              fromDate={date}
              toDate={nextDate}
              xLabels={xLabels}
            />
          </Paper>
          <Paper>
            <h3>Calendar view</h3>
            <MoodCalendarForMonth month={date} />
          </Paper>
          <Paper>
            <h3>Weeks</h3>
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Mood gradient</th>
                  <th>Average mood</th>
                </tr>
              </thead>
              <tbody>
                {normalizedAveragesByWeek.allIds
                  .filter(
                    (dateString) =>
                      dateString >= monthMinus7DaysDateString &&
                      dateString < nextMonthDateString
                  )
                  .map((dateString) => {
                    const week = createDateFromLocalDateString(dateString);
                    const weekStr = formatWeekWithYear(week);
                    return (
                      <tr key={dateString}>
                        <td>
                          <Link
                            to={`../../weeks/${formatIsoDateInLocalTimezone(
                              startOfWeek(week, WEEK_OPTIONS)
                            )}`}
                          >
                            {weekStr}
                          </Link>
                        </td>
                        <td>
                          <MoodGradientForPeriod
                            fromDate={week}
                            toDate={addWeeks(week, 1)}
                          />
                        </td>
                        <MoodCell
                          mood={normalizedAveragesByWeek.byId[dateString]!}
                        />
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Paper>
          <MoodByWeekdayForPeriod fromDate={date} toDate={nextDate} />
          <MoodByHourForPeriod fromDate={date} toDate={nextDate} />
          <MoodCloud
            currentPeriod={{ fromDate: date, toDate: nextDate }}
            previousPeriod={{ fromDate: prevDate, toDate: date }}
          />
          <MoodFrequencyForPeriod fromDate={date} toDate={nextDate} />
        </>
      ) : (
        <Paper>
          <p>No mood data for this month.</p>
        </Paper>
      )}
      <LocationsForPeriod fromDate={date} toDate={nextDate} />
    </Paper.Group>
  );
}
