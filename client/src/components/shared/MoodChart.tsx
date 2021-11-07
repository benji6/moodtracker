import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../constants";
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
  const yLabels: [number, string][] = MOOD_INTEGERS.map((y) => [y, String(y)]);

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
        {hidePoints ? (
          <>
            <Chart.Line color="var(--color-balance-less)" data={data} />
            <Chart.Line data={trendlinePoints} thickness={2} />
          </>
        ) : (
          <>
            <Chart.Line
              color="var(--color-balance-less)"
              data={trendlinePoints}
              thickness={2}
            />
            <Chart.Line data={data} />
            <Chart.Points colorFromY={moodToColor} data={data} />
          </>
        )}
      </Chart.PlotArea>
      <Chart.XAxis labels={xLabels} markers={xLines} />
      <Chart.YAxis labels={yLabels} markers={yLines} />
    </Chart.LineChart>
  );
}
