import { Chart, Paper } from "eri";
import { eachMonthOfInterval } from "date-fns";
import eventsSlice from "../../../../store/eventsSlice";
import { formatIsoMonthInLocalTimezone } from "../../../../utils";
import { formatMinutesAsTimeStringLong } from "../../../../formatters/formatMinutesAsTimeString";
import { monthShortFormatter } from "../../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function SleepByMonthForPeriod({ dateFrom, dateTo }: Props) {
  const navigate = useNavigate();
  const meanMinutesSleptByMonth = useSelector(
    eventsSlice.selectors.meanMinutesSleptByMonth,
  );
  const months = eachMonthOfInterval({ start: dateFrom, end: dateTo }).slice(
    0,
    -1,
  );
  const data = months.map((month) => {
    const minutesSlept =
      meanMinutesSleptByMonth[formatIsoMonthInLocalTimezone(month)];
    const label = monthShortFormatter.format(month);
    return {
      key: label,
      label: label,
      onClick: () =>
        navigate(`/stats/months/${formatIsoMonthInLocalTimezone(month)}`),
      title:
        minutesSlept === undefined
          ? undefined
          : formatMinutesAsTimeStringLong(minutesSlept),
      y: minutesSlept === undefined ? undefined : minutesSlept / 60,
    };
  });

  if (data.every(({ y }) => y === undefined)) return null;
  return (
    <Paper>
      <h3>Average sleep by month</h3>
      <Chart.ColumnChart
        aria-label="Chart displaying average sleep by month"
        data={data}
        rotateXLabels
        xAxisTitle="Month"
        yAxisTitle="Hours slept"
      />
    </Paper>
  );
}
