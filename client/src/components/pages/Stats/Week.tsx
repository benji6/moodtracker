import { Link, Redirect, RouteComponentProps } from "@reach/router";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { TIME } from "../../../constants";
import {
  formatWeek,
  monthLongFormatter,
  weekdayShortFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../dateTimeFormatters";
import { eventsSelector, normalizedMoodsSelector } from "../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
  getIdsInInterval,
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

  const date = startOfWeek(
    createDateFromLocalDateString(weekStr),
    WEEK_OPTIONS
  );
  const nextDate = addWeeks(date, 1);
  const prevDate = subWeeks(date, 1);
  const lastDayOfWeek = subDays(nextDate, 1);

  const showPrevious = date > firstMoodDate;
  const showNext = nextDate <= new Date();

  const moodIdsInWeek = getIdsInInterval(moods.allIds, date, nextDate);

  const xLabels: [number, string][] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++) {
    const d = addDays(date, i);
    xLabels.push([
      (d.getTime() + addDays(d, 1).getTime()) / 2,
      weekdayShortFormatter.format(d),
    ]);
  }

  const xLines: number[] = [];
  for (let i = 0; i <= TIME.daysPerWeek; i++) {
    const d = addDays(date, i);
    xLines.push(d.getTime());
  }

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {formatWeek(date)}
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
        <MoodGradientForPeriod fromDate={date} toDate={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoDateInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              Previous week
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoDateInLocalTimezone(nextDate)}`}>
              Next week
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForWeek dates={[prevDate, date, nextDate]} />
      {moodIdsInWeek.length ? (
        <>
          <Paper>
            <h3>Mood chart</h3>
            <MoodChartForWeek week={date} />
          </Paper>
          <MoodByWeekdayForPeriod
            canDrillDown
            fromDate={date}
            toDate={nextDate}
          />
          <MoodByHourForPeriod fromDate={date} toDate={nextDate} />
          <MoodCloudForPeriod fromDate={date} toDate={nextDate} />
          <MoodFrequencyForPeriod fromDate={date} toDate={nextDate} />
        </>
      ) : (
        <Paper>
          <p>
            No mood data for this week, <Link to="/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
    </Paper.Group>
  );
}
