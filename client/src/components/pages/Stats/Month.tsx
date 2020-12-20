import { Link, Redirect, RouteComponentProps } from "@reach/router";
import {
  addDays,
  addMonths,
  differenceInCalendarDays,
  subMonths,
} from "date-fns";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { dayMonthFormatter, monthFormatter } from "../../../formatters";
import { eventsSelector, moodsSelector } from "../../../selectors";
import {
  formatIsoMonthInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForPeriod from "./MoodSummaryForPeriod";
import MoodCloudForPeriod from "./MoodCloudForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";

const X_LABELS_COUNT = 5;

const isoMonthRegex = /^\d{4}-\d{2}$/;

export default function Month({
  month: monthStr,
}: RouteComponentProps<{ month: string }>) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);

  if (!monthStr || !isoMonthRegex.test(monthStr)) return <Redirect to="/404" />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);
  const finalMoodDate = new Date(moods.allIds[moods.allIds.length - 1]);

  const month = new Date(`${monthStr}T00:00:00`);
  const prevMonth = subMonths(month, 1);
  const nextMonth = addMonths(month, 1);

  const showPrevious = month > firstMoodDate;
  const showNext = nextMonth <= finalMoodDate;

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
        <h2>{monthFormatter.format(month)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevMonth)}`}>
              Previous month
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextMonth)}`}>
              Next month
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummaryForPeriod
        dates={[prevMonth, month, nextMonth, addMonths(nextMonth, 1)]}
        periodType="month"
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
