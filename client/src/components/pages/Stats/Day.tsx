import addHours from "date-fns/addHours";
import { Card, Icon, Paper, SubHeading } from "eri";
import { useSelector } from "react-redux";
import {
  dateWeekdayFormatter,
  formatWeek,
  hourNumericFormatter,
  monthLongFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../formatters/dateTimeFormatters";
import { moodIdsByDateSelector } from "../../../selectors";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import PrevNextControls from "../../shared/PrevNextControls";
import MoodCard from "../../shared/MoodCard";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import startOfWeek from "date-fns/startOfWeek";
import MoodSummaryForDay from "./MoodSummaryForDay";
import MoodChartForPeriod from "./MoodChartForPeriod";
import { TIME } from "../../../constants";
import LocationsForPeriod from "./LocationsForPeriod";
import { Link } from "react-router-dom";
import WeightChartForPeriod from "./WeightChartForPeriod";
import WeatherForPeriod from "./WeatherForPeriod";
import withStatsPage from "../../hocs/withStatsPage";
import addDays from "date-fns/addDays";

const X_LABELS_COUNT = 6;

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Day({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsByDate = useSelector(moodIdsByDateSelector);

  const moodIds = moodIdsByDate[formatIsoDateInLocalTimezone(date)];
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
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
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
      {moodIds && (
        <MoodChartForPeriod
          dateFrom={date}
          dateTo={nextDate}
          xAxisTitle="Time"
          xLabels={xLabels}
        />
      )}
      <WeightChartForPeriod
        dateFrom={date}
        dateTo={nextDate}
        xLabels={xLabels}
      />
      <WeatherForPeriod dateFrom={date} dateTo={nextDate} xLabels={xLabels} />
      <LocationsForPeriod dateFrom={date} dateTo={nextDate} />
      {moodIds ? (
        <Paper>
          <h3>Moods</h3>
          <Card.Group>
            {moodIds.map((id) => (
              <MoodCard id={id} key={id} />
            ))}
          </Card.Group>
        </Paper>
      ) : (
        <Paper>
          <p>No mood data for this day.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}

export default withStatsPage({ addPeriod: addDays, Component: Day });
