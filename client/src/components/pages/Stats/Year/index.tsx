import "./style.css";
import { Icon, Paper, SubHeading } from "eri";
import { Link, useNavigate } from "react-router-dom";
import { addMonths, addYears, eachMonthOfInterval } from "date-fns";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../../utils";
import {
  monthLongFormatter,
  monthNarrowFormatter,
  yearFormatter,
} from "../../../../formatters/dateTimeFormatters";
import LocationsForPeriod from "../LocationsForPeriod";
import MeditationByMonthForPeriod from "./MeditationByMonthForPeriod";
import MeditationImpactForPeriod from "../MeditationImpactForPeriod";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodByLocationForPeriod from "../MoodByLocationForPeriod";
import MoodByMonthForPeriod from "./MoodByMonthForPeriod";
import MoodBySleepForPeriod from "../MoodBySleepForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "../MoodCalendarForMonth";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloud from "../MoodCloud";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import MoodSummaryForYear from "../MoodSummaryForYear";
import PrevNextControls from "../../../shared/PrevNextControls";
import { RootState } from "../../../../store";
import SleepByMonthForPeriod from "./SleepByMonthForPeriod";
import WeatherForPeriod from "../WeatherForPeriod";
import WeightChartForPeriod from "../WeightChartForPeriod";
import eventsSlice from "../../../../store/eventsSlice";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useSelector } from "react-redux";
import withStatsPage from "../../../hocs/withStatsPage";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Year({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsInPeriod(state, date, nextDate),
  );
  const navigate = useNavigate();
  const meanMoodsByMonth = useSelector(eventsSlice.selectors.meanMoodsByMonth);

  const months = eachMonthOfInterval({ start: date, end: nextDate }).slice(
    0,
    -1,
  );

  const calendars = [];
  for (const month of months) {
    const monthString = monthLongFormatter.format(month);
    const averageMood = meanMoodsByMonth[formatIsoDateInLocalTimezone(month)];
    const formattedAverageMood =
      averageMood === undefined
        ? undefined
        : oneDecimalPlaceFormatter.format(averageMood);
    calendars.push(
      <button
        aria-label={`Drill down into ${monthString}`}
        className="m-year__calendar-button br-0 p-1"
        key={String(month)}
        onClick={() =>
          navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`)
        }
        title={
          formattedAverageMood &&
          `Average mood for ${monthString}: ${formattedAverageMood}`
        }
      >
        <h4 className="center">
          {monthString}
          <small>{formattedAverageMood && ` (${formattedAverageMood})`}</small>
        </h4>
        <MoodCalendarForMonth month={month} small />
      </button>,
    );
  }

  const xLabels: string[] = [...Array(12).keys()].map((n) =>
    monthNarrowFormatter.format(addMonths(date, n)),
  );

  return (
    <Paper.Group>
      <Paper>
        <h2>{yearFormatter.format(date)}</h2>
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoYearInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              {yearFormatter.format(prevDate)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoYearInLocalTimezone(nextDate)}`}>
              {yearFormatter.format(nextDate)}
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForYear dates={[prevDate, date, nextDate]} />
      <MoodChartForPeriod
        centerXAxisLabels
        dateFrom={date}
        dateTo={nextDate}
        hidePoints
        xLabels={xLabels}
      />
      {moodIdsInPeriod.length ? (
        <>
          <Paper>
            <h3>
              Calendar view
              <SubHeading>Tap a month to explore it in more detail</SubHeading>
            </h3>
            <div className="m-year__calendar-grid">{calendars}</div>
          </Paper>
          <MoodByMonthForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      ) : (
        <Paper>
          <p>No mood data for this year.</p>
        </Paper>
      )}
      <SleepByMonthForPeriod dateFrom={date} dateTo={nextDate} />
      <MeditationByMonthForPeriod dateFrom={date} dateTo={nextDate} />
      {moodIdsInPeriod.length ? (
        <>
          <MoodByWeekdayForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodCloud
            currentPeriod={{ dateFrom: date, dateTo: nextDate }}
            previousPeriod={{ dateFrom: prevDate, dateTo: date }}
          />
        </>
      ) : null}
      <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
      <MoodByLocationForPeriod dateFrom={date} dateTo={nextDate} />
      <WeatherForPeriod
        centerXAxisLabels
        dateFrom={date}
        dateTo={nextDate}
        xLabels={xLabels}
      />
      <MoodBySleepForPeriod dateFrom={date} dateTo={nextDate} />
      <WeightChartForPeriod
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
  addPeriod: addYears,
  Component: Year,
  dateRegex: /^\d{4}$/,
});
