import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  dayMonthFormatter,
  formatWeekWithYear,
  monthFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../formatters";
import {
  appIsStorageLoadingSelector,
  normalizedAveragesByWeekSelector,
  eventsSelector,
  moodsSelector,
} from "../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";
import MoodCloudForPeriod from "./MoodCloudForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "./MoodCalendarForMonth";
import subMonths from "date-fns/subMonths";
import addMonths from "date-fns/addMonths";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import MoodCell from "./MoodCell";
import startOfWeek from "date-fns/startOfWeek";
import subDays from "date-fns/subDays";

const X_LABELS_COUNT = 5;

const isoMonthRegex = /^\d{4}-\d{2}$/;

export default function Month({
  month: monthStr,
}: RouteComponentProps<{ month: string }>) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
  const normalizedAveragesByWeek = useSelector(
    normalizedAveragesByWeekSelector
  );
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  if (!monthStr || !isoMonthRegex.test(monthStr)) return <Redirect to="/404" />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);

  const month = createDateFromLocalDateString(monthStr);
  const prevMonth = subMonths(month, 1);
  const nextMonth = addMonths(month, 1);
  const nextMonthDateString = formatIsoDateInLocalTimezone(nextMonth);
  const monthMinus7DaysDateString = formatIsoDateInLocalTimezone(
    subDays(month, 7)
  );

  const showPrevious = month > firstMoodDate;
  const showNext = nextMonth <= new Date();

  const moodIdsInMonth = getMoodIdsInInterval(moods.allIds, month, nextMonth);

  const monthLength = differenceInCalendarDays(nextMonth, month);

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const date = addDays(
      month,
      Math.round((i * monthLength) / (X_LABELS_COUNT - 1))
    );
    xLabels.push([date.getTime(), dayMonthFormatter.format(date)]);
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {monthFormatter.format(month)}
          <SubHeading>
            <Link to={`../../years/${formatIsoYearInLocalTimezone(month)}`}>
              {yearFormatter.format(month)}
            </Link>
          </SubHeading>
        </h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevMonth)}`}>
              <Icon draw name="left" size="inherit" />
              {monthFormatter.format(prevMonth)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextMonth)}`}>
              {monthFormatter.format(nextMonth)}
              <Icon draw name="right" size="inherit" />
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummaryForPeriod
        dates={[prevMonth, month, nextMonth, addMonths(nextMonth, 1)]}
        periodType="month"
        showNext={showNext}
      />
      {moodIdsInMonth.length ? (
        <>
          <Paper>
            <h3>Mood chart</h3>
            <MoodChartForPeriod
              fromDate={month}
              toDate={nextMonth}
              xLabels={xLabels}
            />
          </Paper>
          <Paper>
            <h3>Calendar view</h3>
            <MoodCalendarForMonth month={month} />
          </Paper>
          <Paper>
            <h3>Weeks</h3>
            <table>
              <thead>
                <tr>
                  <th>Week</th>
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
                            to={`weeks/${formatIsoDateInLocalTimezone(
                              startOfWeek(week, WEEK_OPTIONS)
                            )}`}
                          >
                            {weekStr}
                          </Link>
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
          <MoodByWeekdayForPeriod fromDate={month} toDate={nextMonth} />
          <MoodFrequencyForPeriod fromDate={month} toDate={nextMonth} />
          <MoodCloudForPeriod fromDate={month} toDate={nextMonth} />
        </>
      ) : (
        <Paper>
          <p>No data for this month.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
