import { Chart, Paper } from "eri";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
} from "../../../../utils";
import { RootState } from "../../../../store";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import EventIcon from "../../../shared/EventIcon";
import { formatMetersToOneNumberWithUnits } from "../../../../formatters/formatDistance";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function RunDistanceByMonthForPeriod({
  dateFrom,
  dateTo,
}: Props) {
  const hasRunDistanceInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.hasRunDistanceInPeriod(state, dateFrom, dateTo),
  );
  const noramlizedTotalRunDistanceByMonth = useSelector(
    eventsSlice.selectors.normalizedTotalRunDistanceByMonth,
  );
  const navigate = useNavigate();

  if (!hasRunDistanceInPeriod) return;

  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );

  return (
    <Paper>
      <h3>
        <EventIcon eventType="runs" margin="end" />
        Total run distance by month
      </h3>
      <Chart.ColumnChart
        aria-label="Chart displaying total run distance by month"
        data={months.map((month) => {
          const totalMeters =
            noramlizedTotalRunDistanceByMonth.byId[
              formatIsoDateInLocalTimezone(month)
            ] ?? 0;
          const label = monthShortFormatter.format(month);
          return {
            key: label,
            label: label,
            onClick: () =>
              navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`),
            title: formatMetersToOneNumberWithUnits(totalMeters),
            y: totalMeters / 1e3,
          };
        })}
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Kilometers"
      />
    </Paper>
  );
}
