import { Icon, Paper, SubHeading } from "eri";
import { TIME } from "../../../constants";
import {
  formatWeek,
  monthLongFormatter,
  weekdayShortFormatter,
  WEEK_OPTIONS,
  yearFormatter,
} from "../../../formatters/dateTimeFormatters";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodSummaryForWeek from "./MoodSummaryForWeek";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import addDays from "date-fns/addDays";
import subDays from "date-fns/subDays";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import PrevNextControls from "../../shared/PrevNextControls";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import LocationsForPeriod from "./LocationsForPeriod";
import { Link } from "react-router-dom";
import MoodCloud from "./MoodCloud";
import WeightChartForPeriod from "./WeightChartForPeriod";
import MoodChartForPeriod from "./MoodChartForPeriod";
import WeatherForPeriod from "./WeatherForPeriod";
import withStatsPage from "../../hocs/withStatsPage";
import startOfWeek from "date-fns/startOfWeek";
import addWeeks from "date-fns/addWeeks";
import useMoodIdsInPeriod from "../../hooks/useMoodIdsInPeriod";
import MeditationImpactForPeriod from "./MeditationImpactForPeriod";
import MoodByLocationForPeriod from "./MoodByLocationForPeriod";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Week({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsInPeriod = useMoodIdsInPeriod(date, nextDate);

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
          <MoodByWeekdayForPeriod
            canDrillDown
            dateFrom={date}
            dateTo={nextDate}
          />
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodCloud
            currentPeriod={{ dateFrom: date, dateTo: nextDate }}
            previousPeriod={{ dateFrom: prevDate, dateTo: date }}
          />
          <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      ) : (
        <Paper>
          <p>
            No mood data for this week, <Link to="/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
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
