import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  dayMonthFormatter,
  monthFormatter,
  yearFormatter,
} from "../../../formatters";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  moodsSelector,
} from "../../../selectors";
import {
  formatIsoYearInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";
import MoodCloudForPeriod from "./MoodCloudForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "./MoodCalendarForMonth";
import differenceInCalendarDays from "date-fns/differenceInCalendarDays";
import addDays from "date-fns/addDays";
import subYears from "date-fns/subYears";
import addYears from "date-fns/addYears";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";

const X_LABELS_COUNT = 5;

const isoYearRegex = /^\d{4}$/;

export default function Year({
  year: yearStr,
}: RouteComponentProps<{ year: string }>) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
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
    calendars.push(
      <div key={String(month)}>
        <h4 className="center">{monthFormatter.format(month)}</h4>
        <MoodCalendarForMonth blockSize="var(--e-space-2)" month={month} />
      </div>
    );
  }
  return (
    <Paper.Group>
      <Paper>
        <h2>{yearFormatter.format(year)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoYearInLocalTimezone(prevYear)}`}>
              Previous year
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoYearInLocalTimezone(nextYear)}`}>
              Next year
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummaryForPeriod
        dates={[prevYear, year, nextYear, addYears(nextYear, 1)]}
        periodType="year"
        showNext={showNext}
      />
      {moodIdsInPeriod.length ? (
        <>
          <Paper>
            <h3>Calendar view</h3>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(8em, 1fr))",
                gridColumnGap: "var(--e-space-1)",
              }}
            >
              {calendars}
            </div>
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
