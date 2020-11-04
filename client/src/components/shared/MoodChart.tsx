import { Chart } from "eri";
import * as React from "react";
import { MOOD_RANGE } from "../../constants";
import { moodToColor } from "../../utils";

interface Props {
  data: [number, number][];
  domain: [number, number];
  trendlinePoints: [number, number][];
  hidePoints?: boolean;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function MoodChart({
  data,
  domain,
  hidePoints = false,
  trendlinePoints,
  xLabels,
  xLines = xLabels.map(([x]) => x),
}: Props) {
  const yLabels: [number, string][] = [
    ...Array(MOOD_RANGE[1] + 1).keys(),
  ].map((y) => [y, String(y)]);

  const yLines = yLabels.map(([y]) => y);

  return (
    <Chart.LineChart
      aria-label="Chart displaying mood against time"
      domain={domain}
      range={MOOD_RANGE}
      xAxisTitle="Date"
      yAxisTitle="Mood"
    >
      <Chart.XGridLines lines={xLines} />
      <Chart.YGridLines lines={yLines} />
      <Chart.PlotArea>
        <Chart.Line
          color={hidePoints ? undefined : "var(--e-color-balance-less)"}
          data={trendlinePoints}
          thickness={2}
        />
        <Chart.Line
          color={hidePoints ? "var(--e-color-balance-less)" : undefined}
          data={data}
        />
        {!hidePoints && <Chart.Points colorFromY={moodToColor} data={data} />}
      </Chart.PlotArea>
      <Chart.XAxis labels={xLabels} markers={xLines} />
      <Chart.YAxis labels={yLabels} markers={yLines} />
    </Chart.LineChart>
  );
}
