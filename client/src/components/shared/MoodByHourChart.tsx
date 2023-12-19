import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE, TIME } from "../../constants";
import { hourNumericFormatter } from "../../formatters/dateTimeFormatters";
import { setHours } from "date-fns";

const arbitraryDate = new Date();

interface Props {
  data: [number, number][];
}

export default function MoodByHourChart({ data }: Props) {
  const xLabels: string[] = [];
  for (let i = 0; i <= TIME.hoursPerDay; i += 4)
    xLabels.push(hourNumericFormatter.format(setHours(arbitraryDate, i)));

  return (
    <Chart.LineChart
      aria-label="Chart displaying average mood against hour of the day"
      domain={[0, TIME.hoursPerDay - 1]}
      range={MOOD_RANGE}
      xAxisTitle="Hour of day"
      yAxisTitle="Mood"
      xAxisLabels={xLabels}
      yAxisLabels={MOOD_INTEGERS.map(String)}
    >
      <Chart.Line data={data} thickness={2} />
    </Chart.LineChart>
  );
}
