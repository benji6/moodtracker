import * as React from "react";
import { Chart } from "eri";
import { setHours } from "date-fns";
import { HOURS_PER_DAY, MOOD_INTEGERS, MOOD_RANGE } from "../../constants";

const arbitraryDate = new Date();
const formatter = Intl.DateTimeFormat(undefined, { hour: "numeric" });

interface Props {
  data: [number, number][];
}

export default function MoodByHourChart({ data }: Props) {
  const xLabels: [number, string][] = [];
  for (let i = 0; i < HOURS_PER_DAY; i += 4)
    xLabels.push([i, formatter.format(setHours(arbitraryDate, i))]);

  const yLabels: [number, string][] = MOOD_INTEGERS.map((y) => [y, String(y)]);

  const xLines = xLabels.map(([x]) => x);
  const yLines = yLabels.map(([y]) => y);

  return (
    <Chart.LineChart
      aria-label="Chart displaying average mood against hour of the day"
      domain={[0, HOURS_PER_DAY - 1]}
      range={MOOD_RANGE}
      xAxisTitle="Hour of day"
      yAxisTitle="Mood"
    >
      <Chart.XGridLines lines={xLines} />
      <Chart.YGridLines lines={yLines} />
      <Chart.PlotArea>
        <Chart.Line data={data} thickness={2} />
      </Chart.PlotArea>
      <Chart.XAxis labels={xLabels} markers={xLines} />
      <Chart.YAxis labels={yLabels} markers={yLines} />
    </Chart.LineChart>
  );
}
