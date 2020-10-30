import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { addDays, addWeeks, startOfWeek } from "date-fns";
import { subWeeks } from "date-fns/esm";
import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { DAYS_PER_WEEK } from "../../../constants";
import {
  formatWeek,
  weekdayShortFormatter,
  WEEK_OPTIONS,
} from "../../../formatters";
import { moodsSelector } from "../../../selectors";
import {
  formatIsoDateInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodChart from "./MoodChart";
import MoodFrequencyChart from "./MoodFrequencyChart";
import MoodSummary from "./MoodSummary";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

const createLocalDate = (dateStr: string) => {
  const date = new Date(dateStr);
  date.setMinutes(date.getTimezoneOffset());
  return date;
};

export default function Week({
  week: weekStr,
}: RouteComponentProps<{ week: string }>) {
  if (!weekStr || !isoDateRegex.test(weekStr)) return <Redirect to="/404" />;

  const moods = useSelector(moodsSelector);

  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);
  const finalMoodDate = new Date(moods.allIds[moods.allIds.length - 1]);

  const week = startOfWeek(createLocalDate(weekStr), WEEK_OPTIONS);
  const nextWeek = addWeeks(week, 1);
  const prevWeek = subWeeks(week, 1);

  const showPrevious = week > firstMoodDate;
  const showNext = nextWeek <= finalMoodDate;

  const moodIdsInWeek = getMoodIdsInInterval(moods.allIds, week, nextWeek);

  const xLabels: [number, string][] = [];
  for (let i = 0; i < DAYS_PER_WEEK; i++) {
    const date = addDays(week, i);
    xLabels.push([
      (date.getTime() + addDays(date, 1).getTime()) / 2,
      weekdayShortFormatter.format(date),
    ]);
  }

  const xLines: number[] = [];
  for (let i = 0; i <= DAYS_PER_WEEK; i++) {
    const date = addDays(week, i);
    xLines.push(date.getTime());
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>{formatWeek(week)}</h2>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          {showPrevious ? (
            <Link to={`../${formatIsoDateInLocalTimezone(prevWeek)}`}>
              Previous week
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoDateInLocalTimezone(nextWeek)}`}>
              Next week
            </Link>
          )}
        </div>
      </Paper>
      <MoodSummary
        dates={[prevWeek, week, nextWeek, addWeeks(nextWeek, 1)]}
        periodName="week"
      />
      {moodIdsInWeek.length ? (
        <>
          <Paper>
            <MoodChart
              fromDate={week}
              toDate={nextWeek}
              xLabels={xLabels}
              xLines={xLines}
            />
          </Paper>
          <MoodFrequencyChart fromDate={week} toDate={nextWeek} />
        </>
      ) : (
        <Paper>
          <p>No data for this week.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
