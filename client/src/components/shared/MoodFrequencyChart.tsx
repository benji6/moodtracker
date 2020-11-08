import { Chart } from "eri";
import * as React from "react";
import { moodToColor } from "../../utils";

const MOOD_FREQUENCY_CHART_MAX_Y_LABELS = 10;

interface Props {
  data: number[];
}

export default function MoodFrequencyChart({ data }: Props) {
  const maxFrequency = Math.max(...data);

  const yLabels: [number, string][] =
    maxFrequency < MOOD_FREQUENCY_CHART_MAX_Y_LABELS
      ? [...Array(maxFrequency + 1).keys()].map((y) => [y, String(y)])
      : [...Array(MOOD_FREQUENCY_CHART_MAX_Y_LABELS).keys()].map((n) => {
          const y = Math.round(
            (n / (MOOD_FREQUENCY_CHART_MAX_Y_LABELS - 1)) * maxFrequency
          );
          return [y, String(y)];
        });

  return (
    <Chart.BarChart
      aria-label="Chart displaying the frequency at which different moods were recorded"
      range={[0, maxFrequency]}
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
