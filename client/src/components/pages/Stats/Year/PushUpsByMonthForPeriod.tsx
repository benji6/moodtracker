import { Chart, Paper } from "eri";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
} from "../../../../utils";
import { RootState } from "../../../../store";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { integerFormatter } from "../../../../formatters/numberFormatters";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import EventIcon from "../../../shared/EventIcon";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function PushUpsByMonthForPeriod({ dateFrom, dateTo }: Props) {
  const hasPushUpsInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasPushUpsInPeriod(state, dateFrom, dateTo),
  );
  const noramlizedTotalPushUpsByMonth = useSelector(
    eventsSlice.selectors.normalizedTotalPushUpsByMonth,
  );
  const navigate = useNavigate();

  if (!hasPushUpsInPeriod) return;

  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );

  return (
    <Paper>
      <h3>
        <EventIcon eventType="push-ups" margin="end" />
        Total push-ups by month
      </h3>
      <Chart.ColumnChart
        aria-label="Chart displaying total push-ups by month"
        data={months.map((month) => {
          const totalPushUps =
            noramlizedTotalPushUpsByMonth.byId[
              formatIsoDateInLocalTimezone(month)
            ] ?? 0;
          const label = monthShortFormatter.format(month);
          return {
            key: label,
            label: label,
            onClick: () =>
              navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`),
            title: `Total push-ups: ${integerFormatter.format(totalPushUps)}`,
            y: totalPushUps,
          };
        })}
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Push-ups"
      />
    </Paper>
  );
}
