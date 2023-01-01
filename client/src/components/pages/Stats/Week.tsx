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

  const xLabels: [number, string][] = [];
  for (let i = 0; i < TIME.daysPerWeek; i++) {
    const d = addDays(date, i);
    xLabels.push([
      (d.getTime() + addDays(d, 1).getTime()) / 2,
      weekdayShortFormatter.format(d),
    ]);
  }

  const xLines: number[] = [];
  for (let i = 0; i <= TIME.daysPerWeek; i++)
    xLines.push(addDays(date, i).getTime());

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
      {moodIdsInPeriod.length ? (
        <>
          <MoodChartForPeriod
            fromDate={date}
            toDate={nextDate}
            xLabels={xLabels}
            xLines={xLines}
          />
          <MoodByWeekdayForPeriod
            canDrillDown
            fromDate={date}
            toDate={nextDate}
          />
          <MoodByHourForPeriod fromDate={date} toDate={nextDate} />
          <MoodCloud
            currentPeriod={{ fromDate: date, toDate: nextDate }}
            previousPeriod={{ fromDate: prevDate, toDate: date }}
          />
          <MoodFrequencyForPeriod fromDate={date} toDate={nextDate} />
        </>
      ) : (
        <Paper>
          <p>
            No mood data for this week, <Link to="/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
      <WeightChartForPeriod
        fromDate={date}
        toDate={nextDate}
        xLabels={xLabels}
        xLines={xLines}
      />
      <WeatherForPeriod
        fromDate={date}
        toDate={nextDate}
        xLabels={xLabels}
        xLines={xLines}
      />
      <LocationsForPeriod fromDate={date} toDate={nextDate} />
    </Paper.Group>
  );
}

export default withStatsPage({
  addPeriod: addWeeks,
  adjustDate: (date) => startOfWeek(date, WEEK_OPTIONS),
  Component: Week,
});
