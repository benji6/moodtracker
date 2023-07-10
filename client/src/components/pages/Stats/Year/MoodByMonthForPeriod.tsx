import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  moodToColor,
} from "../../../../utils";
import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../../selectors";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";
import ColumnChart from "../../../shared/ColumnChart";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { MOOD_EXTENT } from "../../../../constants";
import eachMonthOfInterval from "date-fns/eachMonthOfInterval";
import { Paper } from "eri";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MoodByMonthForPeriod({ dateFrom, dateTo }: Props) {
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector,
  );
  const navigate = useNavigate();

  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );

  return (
    <Paper>
      <h3>Average mood by month</h3>
      <ColumnChart
        aria-label="Chart displaying average mood by month"
        data={months.map((month) => {
          const averageMood =
            normalizedAveragesByMonth.byId[formatIsoDateInLocalTimezone(month)];
          const label = monthShortFormatter.format(month);
          return {
            color:
              averageMood === undefined ? undefined : moodToColor(averageMood),
            key: label,
            label: label,
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
        onBarClick={(i) =>
          navigate(`/stats/months/${formatIsoMonthInLocalTimezone(months[i])}`)
        }
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Average mood"
      />
    </Paper>
  );
}
