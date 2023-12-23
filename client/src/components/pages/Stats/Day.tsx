import { Card, Icon, Paper, SubHeading } from "eri";
import {
  WEEK_OPTIONS,
  dateWeekdayFormatter,
  formatWeek,
  hourNumericFormatter,
  monthLongFormatter,
  yearFormatter,
} from "../../../formatters/dateTimeFormatters";
import { addDays, addHours, startOfWeek } from "date-fns";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import { Link } from "react-router-dom";
import LocationsForPeriod from "./LocationsForPeriod";
import MoodByLocationForPeriod from "./MoodByLocationForPeriod";
import MoodCard from "../../shared/MoodCard";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import MoodSummaryForDay from "./MoodSummaryForDay";
import PrevNextControls from "../../shared/PrevNextControls";
import { TIME } from "../../../constants";
import WeatherForPeriod from "./WeatherForPeriod";
import WeightChartForPeriod from "./WeightChartForPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import withStatsPage from "../../hocs/withStatsPage";

const X_LABELS_COUNT = 7;

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Day({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsByDate = useSelector(eventsSlice.selectors.moodIdsByDate);

  const moodIds = moodIdsByDate[formatIsoDateInLocalTimezone(date)];
  const startOfWeekDate = startOfWeek(date, WEEK_OPTIONS);

  const xLabels: string[] = [];
  for (let i = 0; i < X_LABELS_COUNT; i++)
    xLabels.push(
      hourNumericFormatter.format(
        addHours(
          date,
          Math.round((i * TIME.hoursPerDay) / (X_LABELS_COUNT - 1)),
        ),
      ),
    );

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {dateWeekdayFormatter.format(date)}
          <SubHeading>
            <Link
              to={`../../weeks/${formatIsoDateInLocalTimezone(
                startOfWeekDate,
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
      <MoodByLocationForPeriod dateFrom={date} dateTo={nextDate} />
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
