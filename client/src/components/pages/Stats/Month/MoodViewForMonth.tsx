import {
  WEEK_OPTIONS,
  formatWeekWithYear,
} from "../../../../formatters/dateTimeFormatters";
import { addWeeks, startOfWeek, subDays } from "date-fns";
import {
  createDateFromLocalDateString,
  formatIsoDateInLocalTimezone,
} from "../../../../utils";
import { Link } from "react-router-dom";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodCalendarForMonth from "../MoodCalendarForMonth";
import MoodCell from "../../../shared/MoodCell";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloud from "../MoodCloud";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import MoodGradientForPeriod from "../MoodGradientForPeriod";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import SummaryForMonth from "../SummaryForMonth";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  xLabels: string[];
}

export default function MoodViewForMonth({
  prevDate,
  date,
  nextDate,
  xLabels,
}: Props) {
  const hasMoodsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMoodsInPeriod(state, date, nextDate),
  );
  const meanMoodsByWeek = useSelector(eventsSlice.selectors.meanMoodsByWeek);
  const weeks = Object.keys(meanMoodsByWeek);

  const nextMonthDateString = formatIsoDateInLocalTimezone(nextDate);
  const monthMinus7DaysDateString = formatIsoDateInLocalTimezone(
    subDays(date, 7),
  );

  return (
    <>
      <SummaryForMonth date={date} />
      {hasMoodsInPeriod ? (
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
                {weeks
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
                        <MoodCell mood={meanMoodsByWeek[dateString]!} />
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
          <p>
            No mood data for this month,{" "}
            <Link to="/moods/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
    </>
  );
}
