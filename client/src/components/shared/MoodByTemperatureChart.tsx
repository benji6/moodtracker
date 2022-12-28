import { Chart } from "eri";
import { MOOD_INTEGERS, MOOD_RANGE } from "../../constants";
import { integerFormatter } from "../../formatters/numberFormatters";

const X_LABELS_COUNT = 11;

interface Props {
  coarseGrainedData: [number, number][];
  fineGrainedData: [number, number][];
}

export default function MoodByTemperatureChart({
  coarseGrainedData,
  fineGrainedData,
}: Props) {
  const yLabels: [number, string][] = MOOD_INTEGERS.map((y) => [y, String(y)]);

  const domain: [number, number] = [
    Math.floor(coarseGrainedData[0][0]),
    Math.ceil(coarseGrainedData.at(-1)![0]),
  ];
  const domainExtent = domain[1] - domain[0];
  const xLabels: [number, string][] = [];
  for (let i = 0; i < X_LABELS_COUNT; i++) {
    const x = Math.round(domain[0] + (domainExtent * i) / (X_LABELS_COUNT - 1));
    xLabels.push([x, integerFormatter.format(x)]);
  }

  return (
    <>
      <h4>Average mood by temperature</h4>
      <Chart.LineChart
        aria-label="Chart displaying average mood by temperature"
        domain={domain}
        range={MOOD_RANGE}
        xAxisTitle="Temperature (°C)"
        yAxisTitle="Mood"
      >
        <Chart.XGridLines lines={xLabels.map(([n]) => n)} />
        <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
        <Chart.PlotArea>
          <Chart.Line data={fineGrainedData} thickness={0} />
          <Chart.Line data={coarseGrainedData} thickness={2} />
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers />
        <Chart.YAxis labels={yLabels} markers />
      </Chart.LineChart>
    </>
  );
}
