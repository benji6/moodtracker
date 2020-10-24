import { Link, Redirect, RouteComponentProps } from "@reach/router";
import {
  addDays,
  addWeeks,
  differenceInCalendarDays,
  startOfWeek,
} from "date-fns";
import { subWeeks } from "date-fns/esm";
import { Paper } from "eri";
import * as React from "react";
import {
  dayMonthFormatter,
  formatWeek,
  WEEK_OPTIONS,
} from "../../../formatters";
import {
  formatIsoDateInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import { StateContext } from "../../AppState";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MoodChart from "./MoodChart";
import MoodFrequencyChart from "./MoodFrequencyChart";
import MoodSummary from "./MoodSummary";

const X_LABELS_COUNT = 5;

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

  const state = React.useContext(StateContext);

  if (!state.moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(state.moods.allIds[0]);
  const finalMoodDate = new Date(
    state.moods.allIds[state.moods.allIds.length - 1]
  );

  const week = startOfWeek(createLocalDate(weekStr), WEEK_OPTIONS);
  const nextWeek = addWeeks(week, 1);
  const prevWeek = subWeeks(week, 1);

  const showPrevious = week > firstMoodDate;
  const showNext = nextWeek <= finalMoodDate;

  const moodIdsInWeek = getMoodIdsInInterval(
    state.moods.allIds,
    week,
    nextWeek
  );

  const weekLength = differenceInCalendarDays(nextWeek, week);

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const date = addDays(
      week,
      Math.round((i * weekLength) / (X_LABELS_COUNT - 1))
    );
    xLabels.push([date.getTime(), dayMonthFormatter.format(date)]);
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
            <MoodChart fromDate={week} toDate={nextWeek} xLabels={xLabels} />
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
