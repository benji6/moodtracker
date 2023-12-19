import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
} from "../../../../utils";
import { useSelector } from "react-redux";
import { normalizedTotalSecondsMeditatedByMonthSelector } from "../../../../selectors";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { Chart, Paper } from "eri";
import { TIME } from "../../../../constants";
import { eachMonthOfInterval } from "date-fns";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MeditationByMonthForPeriod({
  dateFrom,
  dateTo,
}: Props) {
  const noramlizedTotalSecondsMeditatedByMonth = useSelector(
    normalizedTotalSecondsMeditatedByMonthSelector,
  );
  const navigate = useNavigate();

  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );

  return (
    <Paper>
      <h3>Hours meditated by month</h3>
      <Chart.ColumnChart
        aria-label="Chart displaying hours meditated by month"
        data={months.map((month) => {
          const secondsMeditated =
            noramlizedTotalSecondsMeditatedByMonth.byId[
              formatIsoDateInLocalTimezone(month)
            ] ?? 0;
          const label = monthShortFormatter.format(month);
          return {
            key: label,
            label: label,
            onClick: () =>
              navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`),
            title: `Hours meditated: ${oneDecimalPlaceFormatter.format(
              secondsMeditated / TIME.secondsPerHour,
            )}`,
            y: (secondsMeditated ?? 0) / TIME.secondsPerHour,
          };
        })}
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Hours meditated"
      />
    </Paper>
  );
}
