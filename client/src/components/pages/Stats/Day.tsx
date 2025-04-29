import { Icon, Paper, SubHeading } from "eri";
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
import { Link } from "react-router";
import LocationForPeriod from "./LocationForPeriod";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import PrevNextControls from "../../shared/PrevNextControls";
import SummaryForDay from "./SummaryForDay";
import { TIME } from "../../../constants";
import TrackedCategoriesList from "../../shared/TrackedCategoriesList";
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
  const allDenormalizedTrackedCategoriesByLocalDate = useSelector(
    eventsSlice.selectors.allDenormalizedTrackedCategoriesByLocalDate,
  );
  const isoDateInLocalTimezone = formatIsoDateInLocalTimezone(date);
  const denormalizedTrackedCategories =
    allDenormalizedTrackedCategoriesByLocalDate[isoDateInLocalTimezone];
  const hasMoodIds = Boolean(
    denormalizedTrackedCategories?.filter(({ type }) => type === "moods")
      .length,
  );
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
      {denormalizedTrackedCategories ? (
        <>
          <SummaryForDay dates={[prevDate, date, nextDate]} />
          {hasMoodIds && (
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
          <LocationForPeriod dateFrom={date} dateTo={nextDate} />;
          <WeatherForPeriod
            dateFrom={date}
            dateTo={nextDate}
            xLabels={xLabels}
          />
          <Paper>
            <h3>Events</h3>
            <TrackedCategoriesList
              isoDateInLocalTimezone={isoDateInLocalTimezone}
            />
          </Paper>
        </>
      ) : (
        <Paper>
          <p>Nothing logged on this day.</p>
        </Paper>
      )}
    </Paper.Group>
  );
}

export default withStatsPage({ addPeriod: addDays, Component: Day });
