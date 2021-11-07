import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../../../constants";
import { formatIsoDateInLocalTimezone, moodToColor } from "../../../../utils";
import { useSelector } from "react-redux";
import { normalizedAveragesByMonthSelector } from "../../../../selectors";
import { monthNarrowFormatter } from "../../../../dateTimeFormatters";

interface IProps {
  months: Date[];
}

export default function MoodByMonthChart({ months }: IProps) {
  const normalizedAveragesByMonth = useSelector(
    normalizedAveragesByMonthSelector
  );

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
        <Chart.Bars colorFromY={moodToColor} data={data} />
      </Chart.PlotArea>
      <Chart.YAxis
        labels={MOOD_INTEGERS.map((mood) => [mood, String(mood)])}
        markers={MOOD_INTEGERS as number[]}
      />
    </Chart.BarChart>
  );
}
