import { Link, Redirect, RouteComponentProps } from "@reach/router";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import { Card, Icon, Paper, Spinner, SubHeading } from "eri";
import { useSelector } from "react-redux";
import {
  dateWeekdayFormatter,
  formatWeek,
  monthLongFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../dateTimeFormatters";
import {
  eventsSelector,
  moodIdsByDateSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import GetStartedCta from "../../shared/GetStartedCta";
import PrevNextControls from "../../shared/PrevNextControls";
import MoodCard from "../../shared/MoodCard";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import startOfWeek from "date-fns/startOfWeek";
import MoodSummaryForDay from "./MoodSummaryForDay";

const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export default function Day({
  day: dateStr,
}: RouteComponentProps<{ day: string }>) {
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const moodIdsByDate = useSelector(moodIdsByDateSelector);

  if (!dateStr || !isoDateRegex.test(dateStr)) return <Redirect to="/404" />;
  if (!events.hasLoadedFromServer) return <Spinner />;
  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  const date = createDateFromLocalDateString(dateStr);
  const nextDate = addDays(date, 1);
  const prevDate = subDays(date, 1);
  const moodIds = moodIdsByDate[dateStr];

  const firstMoodDate = new Date(moods.allIds[0]);
  const showPrevious = date > firstMoodDate;
  const showNext = nextDate <= new Date();

  const startOfWeekDate = startOfWeek(date, WEEK_OPTIONS);

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {dateWeekdayFormatter.format(date)}
          <SubHeading>
            <Link
              to={`../../weeks/${formatIsoDateInLocalTimezone(
                startOfWeekDate
              )}`}
            >
              {formatWeek(startOfWeekDate)}
            </Link>{" "}
            |{" "}
            <Link to={`../../months/${formatIsoMonthInLocalTimezone(date)}`}>
              {monthLongFormatter.format(date)}
            </Link>{" "}
            |{" "}
            <Link to={`../../years/${formatIsoYearInLocalTimezone(date)}`}>
              {yearFormatter.format(date)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod fromDate={date} toDate={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoDateInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              Previous day
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoDateInLocalTimezone(nextDate)}`}>
              Next day
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForDay dates={[prevDate, date, nextDate]} />
      {moodIds ? (
        <Paper>
          <Card.Group>
            {moodIds.map((id) => (
              <MoodCard id={id} key={id} />
            ))}
          </Card.Group>
        </Paper>
      ) : (
        <Paper>
          <p>No data for this day.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}
