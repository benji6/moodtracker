import addDays from "date-fns/addDays";
import addHours from "date-fns/addHours";
import subDays from "date-fns/subDays";
import { Card, Icon, Paper, Spinner, SubHeading } from "eri";
import { useSelector } from "react-redux";
import {
  dateWeekdayFormatter,
  formatWeek,
  hourNumericFormatter,
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
import MoodChartForPeriod from "./MoodChartForPeriod";
import { TIME } from "../../../constants";
import LocationsForPeriod from "./LocationsForPeriod";
import RedirectHome from "../../RedirectHome";
import { Link, useParams } from "react-router-dom";

const X_LABELS_COUNT = 6;
const isoDateRegex = /^\d{4}-\d{2}-\d{2}$/;

export default function Day() {
  const { day: dateStr } = useParams();
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const moodIdsByDate = useSelector(moodIdsByDateSelector);

  if (!dateStr || !isoDateRegex.test(dateStr)) return <RedirectHome />;
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

  const xLabels: [number, string][] = [];

  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const d = addHours(
      date,
      Math.round((i * TIME.hoursPerDay) / X_LABELS_COUNT)
    );
    xLabels.push([d.getTime(), hourNumericFormatter.format(d)]);
  }

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
        <>
          <Paper>
            <h3>Mood chart</h3>
            <MoodChartForPeriod
              fromDate={date}
              toDate={nextDate}
              xAxisTitle="Time"
              xLabels={xLabels}
            />
          </Paper>
          <Paper>
            <h3>Moods</h3>
            <Card.Group>
              {moodIds.map((id) => (
                <MoodCard id={id} key={id} />
              ))}
            </Card.Group>
          </Paper>
        </>
      ) : (
        <Paper>
          <p>No mood data for this day.</p>
        </Paper>
      )}
      <LocationsForPeriod fromDate={date} toDate={nextDate} />
    </Paper.Group>
  );
}
