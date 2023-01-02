import { Chart, Paper } from "eri";
import { useSelector } from "react-redux";
import { integerFormatter } from "../../../formatters/numberFormatters";
import { normalizedWeightsSelector } from "../../../selectors";
import { createChartRange, getEnvelopingIds } from "../../../utils";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function WeightChartForPeriod({
  dateFrom,
  dateTo,
  xLabels,
  xLines,
}: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const envelopingIds = getEnvelopingIds(weights.allIds, dateFrom, dateTo);

  if (envelopingIds.length < 2) return null;

  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const envelopingValues = envelopingIds.map((id) => weights.byId[id].value);

  const range = createChartRange(envelopingValues);

  const data: [number, number][] = envelopingIds.map((id) => {
    const weight = weights.byId[id];
    return [new Date(id).getTime(), weight.value];
  });

  const yLabels: [number, string][] = [...Array(11).keys()].map((n) => {
    const y = Math.round((n / 10) * (range[1] - range[0]) + range[0]);
    return [y, integerFormatter.format(y)];
  });

  const showManyPointsVariation = data.length >= 48;

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
          <Chart.Line
            data={data}
            thickness={showManyPointsVariation ? 2 : undefined}
          />
          {!showManyPointsVariation && <Chart.Points data={data} />}
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers={xLines ?? true} />
        <Chart.YAxis labels={yLabels} markers />
      </Chart.LineChart>
    </Paper>
  );
}
