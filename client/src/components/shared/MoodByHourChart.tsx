import setHours from "date-fns/setHours";
import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE, TIME } from "../../constants";
import { hourNumericFormatter } from "../../dateTimeFormatters";

const arbitraryDate = new Date();

interface Props {
  data: [number, number][];
}

export default function MoodByHourChart({ data }: Props) {
  const xLabels: [number, string][] = [];
  for (let i = 0; i < TIME.hoursPerDay; i += 4)
    xLabels.push([i, hourNumericFormatter.format(setHours(arbitraryDate, i))]);

  const yLabels: [number, string][] = MOOD_INTEGERS.map((y) => [y, String(y)]);

  return (
    <Chart.LineChart
      aria-label="Chart displaying average mood against hour of the day"
      domain={[0, TIME.hoursPerDay - 1]}
      range={MOOD_RANGE}
      xAxisTitle="Hour of day"
      yAxisTitle="Mood"
    >
      <Chart.XGridLines lines={xLabels.map(([x]) => x)} />
      <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
      <Chart.PlotArea>
        <Chart.Line data={data} thickness={2} />
      </Chart.PlotArea>
      <Chart.XAxis labels={xLabels} markers />
      <Chart.YAxis labels={yLabels} markers />
    </Chart.LineChart>
  );
}
