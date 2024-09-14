import { MOOD_INTEGERS, MOOD_RANGE } from "../../constants";
import { Chart } from "eri";
import { createChartExtent } from "../../utils";

interface Props {
  coarseGrainedData: [number, number][];
  fineGrainedData: [number, number][];
}

export default function MoodByTemperatureChart({
  coarseGrainedData,
  fineGrainedData,
}: Props) {
  return (
    <>
      <h3>Average mood by temperature</h3>
      <Chart.LineChart
        aria-label="Chart displaying average mood by temperature"
        domain={createChartExtent(coarseGrainedData.map(([x]) => x))}
        range={MOOD_RANGE}
        xAxisTitle="Temperature (°C)"
        yAxisLabels={MOOD_INTEGERS.map(String)}
        yAxisTitle="Mood"
      >
        <Chart.Line data={fineGrainedData} thickness={0} />
        <Chart.Line data={coarseGrainedData} thickness={2} />
      </Chart.LineChart>
    </>
  );
}
