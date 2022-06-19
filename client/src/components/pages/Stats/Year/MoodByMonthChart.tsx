import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../../constants";
import {
  formatIsoDateInLocalTimezone,
  formatIsoMonthInLocalTimezone,
  moodToColor,
} from "../../../../utils";
import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../../selectors";
import { monthNarrowFormatter } from "../../../../dateTimeFormatters";
import { useNavigate } from "react-router-dom";

interface Props {
  months: Date[];
}

export default function MoodByMonthChart({ months }: Props) {
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector
  );
  const navigate = useNavigate();

  const xLabels: string[] = [];
  const data: (number | undefined)[] = [];

  for (const month of months) {
    xLabels.push(monthNarrowFormatter.format(month));
    data.push(
      normalizedAveragesByMonth.byId[formatIsoDateInLocalTimezone(month)]
    );
  }

  return (
    <Chart.BarChart
      aria-label="Chart displaying average mood by month"
      range={MOOD_RANGE}
      xAxisTitle="Month"
      xLabels={xLabels}
      yAxisTitle="Average mood"
    >
      <Chart.YGridLines lines={MOOD_INTEGERS as number[]} />
      <Chart.PlotArea>
        <Chart.Bars
          colorFromY={moodToColor}
          data={data}
          onClick={(i) =>
            navigate(
              `/stats/months/${formatIsoMonthInLocalTimezone(months[i])}`
            )
          }
        />
      </Chart.PlotArea>
      <Chart.YAxis
        labels={MOOD_INTEGERS.map((mood) => [mood, String(mood)])}
        markers
      />
    </Chart.BarChart>
  );
}
