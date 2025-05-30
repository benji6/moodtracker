import { Chart, Paper } from "eri";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
} from "../../../../utils";
import { RootState } from "../../../../store";
import { TIME } from "../../../../constants";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { oneDecimalPlaceFormatter } from "../../../../formatters/numberFormatters";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function MeditationByMonthForPeriod({
  dateFrom,
  dateTo,
}: Props) {
  const hasMeditationsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasMeditationsInPeriod(state, dateFrom, dateTo),
  );
  const noramlizedTotalSecondsMeditatedByMonth = useSelector(
    eventsSlice.selectors.normalizedTotalSecondsMeditatedByMonth,
  );
  const navigate = useNavigate();

  if (!hasMeditationsInPeriod) return;

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
