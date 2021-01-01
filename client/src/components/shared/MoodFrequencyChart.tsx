import { Chart } from "eri";
import * as React from "react";
import { moodToColor } from "../../utils";

// really this is the count minus 1 because it excludes 0
const Y_LABELS_COUNT = 10;

interface Props {
  data: number[];
}

export default function MoodFrequencyChart({ data }: Props) {
  const maxYLabel =
    Math.ceil(Math.max(...data) / Y_LABELS_COUNT) * Y_LABELS_COUNT;

  const yLabels: [number, string][] = [...Array(Y_LABELS_COUNT + 1).keys()].map(
    (n) => {
      const y = Math.round((n / Y_LABELS_COUNT) * maxYLabel);
      return [y, String(y)];
    }
  );

  return (
    <Chart.BarChart
      aria-label="Chart displaying the frequency at which different moods were recorded"
      range={[0, maxYLabel]}
      xAxisTitle="Mood"
      xLabels={data.map((_, i) => i).map(String)}
      yAxisTitle="Count"
    >
      <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
      <Chart.PlotArea>
        <Chart.Bars colorFromX={(x) => moodToColor(x * 10)} data={data} />
      </Chart.PlotArea>
      <Chart.YAxis labels={yLabels} markers={yLabels.map(([y]) => y)} />
    </Chart.BarChart>
  );
}
