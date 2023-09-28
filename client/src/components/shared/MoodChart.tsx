import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../constants";
import { moodToColor } from "../../utils";

interface Props {
  centerXAxisLabels?: boolean;
  data: [number, number][];
  domain: [number, number];
  trendlinePoints: [number, number][];
  hidePoints?: boolean;
  xAxisTitle?: string;
  xLabels: string[];
}

export default function MoodChart({
  centerXAxisLabels = false,
  data,
  domain,
  hidePoints = false,
  trendlinePoints,
  xAxisTitle = "Date",
  xLabels,
}: Props) {
  return (
    <Chart.LineChart
      aria-label="Chart displaying mood against time"
      centerXAxisLabels={centerXAxisLabels}
      domain={domain}
      range={MOOD_RANGE}
      xAxisLabels={xLabels}
      xAxisTitle={xAxisTitle}
      yAxisLabels={MOOD_INTEGERS.map(String)}
      yAxisTitle="Mood"
    >
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
    </Chart.LineChart>
  );
}
