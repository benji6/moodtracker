import { Icon, Paper, SubHeading } from "eri";
import {
  WEEK_OPTIONS,
  dayMonthFormatter,
  formatWeekWithYear,
  monthLongFormatter,
  yearFormatter,
} from "../../../formatters/dateTimeFormatters";
import {
  addDays,
  addMonths,
  addWeeks,
  differenceInCalendarDays,
  startOfWeek,
  subDays,
} from "date-fns";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  formatIsoYearInLocalTimezone,
} from "../../../utils";
import { Link } from "react-router-dom";
import LocationsForPeriod from "./LocationsForPeriod";
import MeditationImpactForPeriod from "./MeditationImpactForPeriod";
import MoodByHourForPeriod from "./MoodByHourForPeriod";
import MoodByLocationForPeriod from "./MoodByLocationForPeriod";
import MoodByWeekdayForPeriod from "./MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "./MoodCalendarForMonth";
import MoodCell from "../../shared/MoodCell";
import MoodChartForPeriod from "./MoodChartForPeriod";
import MoodCloud from "./MoodCloud";
import MoodFrequencyForPeriod from "./MoodFrequencyForPeriod";
import MoodGradientForPeriod from "./MoodGradientForPeriod";
import MoodSummaryForMonth from "./MoodSummaryForMonth";
import PrevNextControls from "../../shared/PrevNextControls";
import { RootState } from "../../../store";
import WeatherForPeriod from "./WeatherForPeriod";
import WeightChartForPeriod from "./WeightChartForPeriod";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import withStatsPage from "../../hocs/withStatsPage";

const X_LABELS_COUNT = 5;

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  showNext: boolean;
  showPrevious: boolean;
}

function Month({ date, nextDate, prevDate, showNext, showPrevious }: Props) {
  const moodIdsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.moodIdsInPeriod(state, date, nextDate),
  );
  const normalizedAveragesByWeek = useSelector(
    eventsSlice.selectors.normalizedAveragesByWeek,
  );

  const nextMonthDateString = formatIsoDateInLocalTimezone(nextDate);
  const monthMinus7DaysDateString = formatIsoDateInLocalTimezone(
    subDays(date, 7),
  );

  const monthLength = differenceInCalendarDays(nextDate, date);

  const xLabels: string[] = [];
  for (let i = 0; i < X_LABELS_COUNT; i++)
    xLabels.push(
      dayMonthFormatter.format(
        addDays(date, Math.round((i * monthLength) / (X_LABELS_COUNT - 1))),
      ),
    );

  return (
    <Paper.Group>
      <Paper>
        <h2>
          {monthLongFormatter.format(date)}
          <SubHeading>
            <Link to={`../../years/${formatIsoYearInLocalTimezone(date)}`}>
              {yearFormatter.format(date)}
            </Link>
          </SubHeading>
        </h2>
        <MoodGradientForPeriod dateFrom={date} dateTo={nextDate} />
        <PrevNextControls>
          {showPrevious ? (
            <Link to={`../${formatIsoMonthInLocalTimezone(prevDate)}`}>
              <Icon margin="end" name="left" />
              {monthLongFormatter.format(prevDate)}
            </Link>
          ) : (
            <span />
          )}
          {showNext && (
            <Link to={`../${formatIsoMonthInLocalTimezone(nextDate)}`}>
              {monthLongFormatter.format(nextDate)}
              <Icon margin="start" name="right" />
            </Link>
          )}
        </PrevNextControls>
      </Paper>
      <MoodSummaryForMonth dates={[prevDate, date, nextDate]} />
      {moodIdsInPeriod.length ? (
        <>
          <MoodChartForPeriod
            dateFrom={date}
            dateTo={nextDate}
            xLabels={xLabels}
          />
          <Paper>
            <h3>Calendar view</h3>
            <MoodCalendarForMonth month={date} />
          </Paper>
          <Paper>
            <h3>Weeks</h3>
            <table>
              <thead>
                <tr>
                  <th>Week</th>
                  <th>Mood gradient</th>
                  <th>Average mood</th>
                </tr>
              </thead>
              <tbody>
                {normalizedAveragesByWeek.allIds
                  .filter(
                    (dateString) =>
                      dateString >= monthMinus7DaysDateString &&
                      dateString < nextMonthDateString,
                  )
                  .map((dateString) => {
                    const week = createDateFromLocalDateString(dateString);
                    const weekStr = formatWeekWithYear(week);
                    return (
                      <tr key={dateString}>
                        <td>
                          <Link
                            to={`../../weeks/${formatIsoDateInLocalTimezone(
                              startOfWeek(week, WEEK_OPTIONS),
                            )}`}
                          >
                            {weekStr}
                          </Link>
                        </td>
                        <td>
                          <MoodGradientForPeriod
                            dateFrom={week}
                            dateTo={addWeeks(week, 1)}
                          />
                        </td>
                        <MoodCell
                          mood={normalizedAveragesByWeek.byId[dateString]!}
                        />
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </Paper>
          <MoodByWeekdayForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodCloud
            currentPeriod={{ dateFrom: date, dateTo: nextDate }}
            previousPeriod={{ dateFrom: prevDate, dateTo: date }}
          />
          <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
        </>
      ) : (
        <Paper>
          <p>No mood data for this month.</p>
        </Paper>
      )}
      <WeightChartForPeriod
        dateFrom={date}
        dateTo={nextDate}
        xLabels={xLabels}
      />
      <MoodByLocationForPeriod dateFrom={date} dateTo={nextDate} />
      <WeatherForPeriod dateFrom={date} dateTo={nextDate} xLabels={xLabels} />
      <MeditationImpactForPeriod dateFrom={date} dateTo={nextDate} />
      <LocationsForPeriod dateFrom={date} dateTo={nextDate} />
    </Paper.Group>
  );
}

export default withStatsPage({
  addPeriod: addMonths,
  dateRegex: /^\d{4}-\d{2}$/,
  Component: Month,
});
