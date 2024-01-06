import { Chart, Paper } from "eri";
import { WEEKDAY_LABELS_SHORT } from "../../../constants";
import { addDays } from "date-fns";
import eventsSlice from "../../../store/eventsSlice";
import { formatIsoDateInLocalTimezone } from "../../../utils";
import { formatMinutesAsTimeStringLong } from "../../../formatters/formatMinutesAsTimeString";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
}

export default function SleepChartForWeek({ dateFrom }: Props) {
  const navigate = useNavigate();
  const minutesSleptByDateAwoke = useSelector(
    eventsSlice.selectors.minutesSleptByDateAwoke,
  );

  const data: { dateString: string; minutesSlept: number; weekday: string }[] =
    [];
  for (let i = 0; i < WEEKDAY_LABELS_SHORT.length; i++) {
    const dateString = formatIsoDateInLocalTimezone(addDays(dateFrom, i));
    data.push({
      dateString,
      minutesSlept: minutesSleptByDateAwoke[dateString],
      weekday: WEEKDAY_LABELS_SHORT[i],
    });
  }

  if (data.every(({ minutesSlept }) => minutesSlept === undefined)) return null;

  return (
    <Paper>
      <h3>Sleep chart</h3>
      <Chart.ColumnChart
        aria-label="Chart displaying sleep by day"
        data={data.map(({ dateString, minutesSlept, weekday }) => ({
          key: dateString,
          label: weekday,
          onClick: () => navigate(`/stats/days/${dateString}`),
          title:
            minutesSlept === undefined
              ? undefined
              : formatMinutesAsTimeStringLong(minutesSlept),
          y: minutesSlept === undefined ? undefined : minutesSlept / 60,
        }))}
        rotateXLabels
        xAxisTitle="Day"
        yAxisTitle="Hours slept"
      />
    </Paper>
  );
}
