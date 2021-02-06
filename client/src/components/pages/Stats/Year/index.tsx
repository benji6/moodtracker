import {
  Link,
  Redirect,
  RouteComponentProps,
  useNavigate,
} from "@reach/router";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  dayMonthFormatter,
  monthFormatter,
  moodFormatter,
  yearFormatter,
} from "../../../../formatters";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  normalizedMoodsSelector,
  normalizedAveragesByMonthSelector,
} from "../../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../../utils";
import useRedirectUnauthed from "../../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../../shared/AddFirstMoodCta";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import MoodSummaryForYear from "../MoodSummaryForYear";
import MoodCloudForPeriod from "../MoodCloudForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "../MoodCalendarForMonth";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import subYears from "date-fns/subYears";
import addYears from "date-fns/addYears";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import "./style.css";
import MoodCell from "../../../shared/MoodCell";

const X_LABELS_COUNT = 5;

const isoYearRegex = /^\d{4}$/;

export default function Year({
  year: yearStr,
}: RouteComponentProps<{ year: string }>) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const navigate = useNavigate();
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector
  );
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  if (!yearStr || !isoYearRegex.test(yearStr)) return <Redirect to="/404" />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);

  const year = new Date(yearStr);
  const prevYear = subYears(year, 1);
  const nextYear = addYears(year, 1);

  const yearDateString = formatIsoDateInLocalTimezone(year);
  const nextYearDateString = formatIsoDateInLocalTimezone(nextYear);

  const showPrevious = year > firstMoodDate;
  const showNext = nextYear <= new Date();

  const moodIdsInPeriod = getMoodIdsInInterval(moods.allIds, year, nextYear);
  const periodLength = differenceInCalendarDays(nextYear, year);

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const date = addDays(
      year,
      Math.round((i * periodLength) / (X_LABELS_COUNT - 1))
    );
    xLabels.push([date.getTime(), dayMonthFormatter.format(date)]);
  }

  const months = eachMonthOfInterval({ start: year, end: nextYear });

  const calendars = [];

  for (let i = 0; i < months.length - 1; i++) {
    const month = months[i];
    const monthString = monthFormatter.format(month);
    const averageMood =
      normalizedAveragesByMonth.byId[formatIsoDateInLocalTimezone(month)];
    const formattedAverageMood =
      averageMood === undefined ? undefined : moodFormatter.format(averageMood);
    calendars.push(
      <button
        aria-label={`Drill down into ${monthString}`}
        className="m-calendar-button"
        key={String(month)}
        onClick={() =>
          navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`)
        }
        title={
          formattedAverageMood &&
          `Average mood for ${monthString}: ${formattedAverageMood}`
        }
      >
        <h4 className="center">
          {monthString}
          <small>{formattedAverageMood && ` (${formattedAverageMood})`}</small>
        </h4>
        <MoodCalendarForMonth blockSize="var(--e-space-2)" month={month} />
      </button>
    );
  }
  return (
    <Paper.Group>
      <Paper>
        <h2>{yearFormatter.format(year)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoYearInLocalTimezone(prevYear)}`}>
              <Icon draw name="left" size="inherit" />
              {yearFormatter.format(prevYear)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoYearInLocalTimezone(nextYear)}`}>
              {yearFormatter.format(nextYear)}
              <Icon draw name="right" size="inherit" />
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummaryForYear
        dates={[prevYear, year, nextYear, addYears(nextYear, 1)]}
        showNext={showNext}
      />
      {moodIdsInPeriod.length ? (
        <>
          <Paper>
            <h3>
              Calendar view
              <SubHeading>Tap a month to explore it in more detail</SubHeading>
            </h3>
            <div
              style={{
                alignItems: "start",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(8em, 1fr))",
                gridGap: "var(--e-space-0)",
              }}
            >
              {calendars}
            </div>
          </Paper>
          <Paper>
            <h3>Months</h3>
            <table>
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Average mood</th>
                </tr>
              </thead>
              <tbody>
                {normalizedAveragesByMonth.allIds
                  .filter(
                    (dateString) =>
                      dateString >= yearDateString &&
                      dateString < nextYearDateString
                  )
                  .map((dateString) => {
                    const month = createDateFromLocalDateString(dateString);
                    const monthStringFormatted = monthFormatter.format(month);
                    return (
                      <tr key={dateString}>
                        <td>
                          <Link
                            to={`../../months/${formatIsoMonthInLocalTimezone(
                              month
                            )}`}
                          >
                            {monthStringFormatted}
                          </Link>
                        </td>
                        <MoodCell
                          mood={normalizedAveragesByMonth.byId[dateString]!}
                        />
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Paper>
          <MoodByWeekdayForPeriod fromDate={year} toDate={nextYear} />
          <MoodFrequencyForPeriod fromDate={year} toDate={nextYear} />
          <MoodCloudForPeriod fromDate={year} toDate={nextYear} />
        </>
      ) : (
        <Paper>
          <p>No data for this year.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
