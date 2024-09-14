import { Link } from "react-router-dom";
import MoodByHourForPeriod from "../MoodByHourForPeriod";
import MoodByWeekdayForPeriod from "../MoodByWeekdayForPeriod";
import MoodChartForPeriod from "../MoodChartForPeriod";
import MoodCloud from "../MoodCloud";
import MoodFrequencyForPeriod from "../MoodFrequencyForPeriod";
import { Paper } from "eri";
import { RootState } from "../../../../store";
import SummaryForWeek from "../SummaryForWeek";
import eventsSlice from "../../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  date: Date;
  nextDate: Date;
  prevDate: Date;
  xLabels: string[];
}

export default function MoodViewForWeek({
  prevDate,
  date,
  nextDate,
  xLabels,
}: Props) {
  const hasMoodsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMoodsInPeriod(state, date, nextDate),
  );

  return (
    <>
      <SummaryForWeek date={date} />
      {hasMoodsInPeriod ? (
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
            No mood data for this week,{" "}
            <Link to="/moods/add">add a mood here</Link>!
          </p>
        </Paper>
      )}
      <MoodFrequencyForPeriod dateFrom={date} dateTo={nextDate} />
      {hasMoodsInPeriod && (
        <>
          <MoodByHourForPeriod dateFrom={date} dateTo={nextDate} />
          <MoodByWeekdayForPeriod
            canDrillDown
            dateFrom={date}
            dateTo={nextDate}
          />
        </>
      )}
    </>
  );
}
