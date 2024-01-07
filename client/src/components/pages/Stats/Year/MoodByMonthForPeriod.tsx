import { Chart, Paper } from "eri";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  moodToColor,
} from "../../../../utils";
import { MOOD_EXTENT } from "../../../../constants";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByMonthForPeriod({ dateFrom, dateTo }: Props) {
  const meanMoodsByMonth = useSelector(eventsSlice.selectors.meanMoodsByMonth);
  const navigate = useNavigate();

  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );

  return (
    <Paper>
      <h3>Average mood by month</h3>
      <Chart.ColumnChart
        aria-label="Chart displaying average mood by month"
        data={months.map((month) => {
          const averageMood =
            meanMoodsByMonth[formatIsoDateInLocalTimezone(month)];
          const label = monthShortFormatter.format(month);
          return {
            color:
              averageMood === undefined ? undefined : moodToColor(averageMood),
            key: label,
            label: label,
            onClick: () =>
              navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`),
            title:
              averageMood === undefined
                ? undefined
                : `Average mood: ${oneDecimalPlaceFormatter.format(
                    averageMood,
                  )}`,
            y: averageMood,
          };
        })}
        maxRange={MOOD_EXTENT}
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Average mood"
      />
    </Paper>
  );
}
