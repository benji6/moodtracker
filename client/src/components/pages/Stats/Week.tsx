import { Icon, Paper, SubHeading } from "eri";
import {
  WEEK_OPTIONS,
  formatWeek,
  monthLongFormatter,
  weekdayShortFormatter,
  yearFormatter,
} from "../../../formatters/dateTimeFormatters";
import { addDays, addWeeks, startOfWeek, subDays } from "date-fns";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import { Link } from "react-router-dom";
import LocationsForPeriod from "./LocationsForPeriod";
import MeditationImpactForPeriod from "./MeditationImpactForPeriod";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import MoodByLocationForPeriod from "./MoodByLocationForPeriod";
import MoodBySleepForPeriod from "./MoodBySleepForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodCloud from "./MoodCloud";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import MoodSummaryForWeek from "./MoodSummaryForWeek";
import PrevNextControls from "../../shared/PrevNextControls";
import { RootState } from "../../../store";
import SleepChartForWeek from "./SleepChartForWeek";
import { TIME } from "../../../constants";
import WeatherForPeriod from "./WeatherForPeriod";
import WeightChartForPeriod from "./WeightChartForPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import withStatsPage from "../../hocs/withStatsPage";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Week({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsInPeriod(state, date, nextDate),
  );

  const lastDayOfWeek = subDays(nextDate, 1);

  const xLabels: string[] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++)
    xLabels.push(weekdayShortFormatter.format(addDays(date, i)));

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {formatWeek(date)}
          <SubHeading>
            <Link
              to={`../../months/${formatIsoMonthInLocalTimezone(
                lastDayOfWeek,
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
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
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
      {moodIdsInPeriod.length ? (
        <>
          <MoodChartForPeriod
            centerXAxisLabels
            dateFrom={date}
            dateTo={nextDate}
            xLabels={xLabels}
          />
          <MoodCloud
            currentPeriod={{ dateFrom: date, dateTo: nextDate }}
            previousPeriod={{ dateFrom: prevDate, dateTo: date }}
          />
        </>
      ) : (
        <Paper>
          <p>
            No mood data for this week, <Link to="/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
      <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
      {moodIdsInPeriod.length ? (
        <>
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodByWeekdayForPeriod
            canDrillDown
            dateFrom={date}
            dateTo={nextDate}
          />
        </>
      ) : null}
      <SleepChartForWeek dateFrom={date} />
      <MoodBySleepForPeriod dateFrom={date} dateTo={nextDate} />
      <WeightChartForPeriod
        centerXAxisLabels
        dateFrom={date}
        dateTo={nextDate}
        xLabels={xLabels}
      />
      <MoodByLocationForPeriod dateFrom={date} dateTo={nextDate} />
      <WeatherForPeriod
        centerXAxisLabels
        dateFrom={date}
        dateTo={nextDate}
        xLabels={xLabels}
      />
      <MeditationImpactForPeriod dateFrom={date} dateTo={nextDate} />
      <LocationsForPeriod dateFrom={date} dateTo={nextDate} />
    </Paper.Group>
  );
}

export default withStatsPage({
  addPeriod: addWeeks,
  adjustDate: (date) => startOfWeek(date, WEEK_OPTIONS),
  Component: Week,
});
