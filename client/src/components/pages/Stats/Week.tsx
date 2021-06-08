import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { TIME } from "../../../constants";
import {
  formatWeek,
  monthLongFormatter,
  weekdayShortFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../formatters";
import { eventsSelector, normalizedMoodsSelector } from "../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getMoodIdsInInterval,
} from "../../../utils";
import GetStartedCta from "../../shared/GetStartedCta";
import MoodChartForWeek from "./MoodChartForWeek";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForWeek from "./MoodSummaryForWeek";
import MoodCloudForPeriod from "./MoodCloudForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import startOfWeek from "date-fns/startOfWeek";
import addWeeks from "date-fns/addWeeks";
import subWeeks from "date-fns/subWeeks";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import PrevNextControls from "../../shared/PrevNextControls";
import MoodGradientForPeriod from "./MoodGradientForPeriod";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export default function Week({
  week: weekStr,
}: RouteComponentProps<{ week: string }>) {
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!weekStr || !isoDateRegex.test(weekStr)) return <Redirect to="/404" />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  const firstMoodDate = new Date(moods.allIds[0]);

  const week = startOfWeek(
    createDateFromLocalDateString(weekStr),
    WEEK_OPTIONS
  );
  const nextWeek = addWeeks(week, 1);
  const lastDayOfWeek = subDays(nextWeek, 1);
  const prevWeek = subWeeks(week, 1);

  const showPrevious = week > firstMoodDate;
  const showNext = nextWeek <= new Date();

  const moodIdsInWeek = getMoodIdsInInterval(moods.allIds, week, nextWeek);

  const xLabels: [number, string][] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++) {
    const date = addDays(week, i);
    xLabels.push([
      (date.getTime() + addDays(date, 1).getTime()) / 2,
      weekdayShortFormatter.format(date),
    ]);
  }

  const xLines: number[] = [];
  for (let i = 0; i <= TIME.daysPerWeek; i++) {
    const date = addDays(week, i);
    xLines.push(date.getTime());
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {formatWeek(week)}
          <SubHeading>
            <Link
              to={`../../months/${formatIsoMonthInLocalTimezone(
                lastDayOfWeek
              )}`}
            >
              {monthLongFormatter.format(lastDayOfWeek)}
            </Link>{" "}
            |{" "}
            <Link
              to={`../../years/${formatIsoYearInLocalTimezone(lastDayOfWeek)}`}
            >
              {yearFormatter.format(lastDayOfWeek)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod fromDate={week} toDate={nextWeek} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoDateInLocalTimezone(prevWeek)}`}>
              <Icon margin="right" name="left" />
              Previous week
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoDateInLocalTimezone(nextWeek)}`}>
              Next week
              <Icon margin="left" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForWeek
        dates={[prevWeek, week, nextWeek, addWeeks(nextWeek, 1)]}
        showNext={showNext}
      />
      {moodIdsInWeek.length ? (
        <>
          <Paper>
            <h3>Mood chart</h3>
            <MoodChartForWeek week={week} />
          </Paper>
          <MoodByWeekdayForPeriod
            canDrillDown
            fromDate={week}
            toDate={nextWeek}
          />
          <MoodByHourForPeriod fromDate={week} toDate={nextWeek} />
          <MoodCloudForPeriod fromDate={week} toDate={nextWeek} />
          <MoodFrequencyForPeriod fromDate={week} toDate={nextWeek} />
        </>
      ) : (
        <Paper>
          <p>
            No data for this week, <Link to="/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
    </Paper.Group>
  );
}
