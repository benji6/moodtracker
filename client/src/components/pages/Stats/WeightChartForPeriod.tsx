import { Chart, Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../selectors";
import { getEnvelopingCategoryIds } from "../../../utils";

const MINIMUM_RANGE_EXTENT = 50;
const roundUpToNearest50 = (n: number) => Math.ceil(n / 50) * 50;

interface Props {
  fromDate: Date;
  toDate: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function WeightChartForPeriod({
  fromDate,
  toDate,
  xLabels,
  xLines,
}: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const envelopingIds = getEnvelopingCategoryIds(
    weights.allIds,
    fromDate,
    toDate
  );

  if (envelopingIds.length < 2) return null;

  const domain: [number, number] = [fromDate.getTime(), toDate.getTime()];
  const biggestValue = Math.max(
    ...envelopingIds.map((id) => weights.byId[id].value)
  );

  const range: [number, number] = [
    0,
    Math.max(roundUpToNearest50(biggestValue), MINIMUM_RANGE_EXTENT),
  ];
  const data: [number, number][] = envelopingIds.map((id) => {
    const weight = weights.byId[id];
    return [new Date(id).getTime(), weight.value];
  });

  const yLabels: [number, string][] = [...Array(11).keys()].map((n) => {
    const y = Math.round((n / 10) * range[1]);
    return [y, String(y)];
  });

  return (
    <Paper>
      <h3>Weight chart</h3>
      <Chart.LineChart
        aria-label="Chart displaying weight against time"
        domain={domain}
        range={range}
        yAxisTitle="Weight (kg)"
      >
        <Chart.XGridLines lines={xLines ?? xLabels.map(([n]) => n)} />
        <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
        <Chart.PlotArea>
          <Chart.Line data={data} />
          <Chart.Points data={data} />
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers={xLines ?? true} />
        <Chart.YAxis labels={yLabels} markers />
      </Chart.LineChart>
    </Paper>
  );
}
