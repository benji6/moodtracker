import { Chart, Paper } from "eri";
import { useSelector } from "react-redux";
import { normalizedWeightsSelector } from "../../../selectors";
import { createChartExtent, getEnvelopingIds } from "../../../utils";

interface Props {
  centerXAxisLabels?: boolean;
  dateFrom: Date;
  dateTo: Date;
  xLabels: string[];
}

export default function WeightChartForPeriod({
  centerXAxisLabels = false,
  dateFrom,
  dateTo,
  xLabels,
}: Props) {
  const weights = useSelector(normalizedWeightsSelector);
  const envelopingIds = getEnvelopingIds(weights.allIds, dateFrom, dateTo);

  if (envelopingIds.length < 2) return;

  const domain: [number, number] = [dateFrom.getTime(), dateTo.getTime()];
  const envelopingValues = envelopingIds.map((id) => weights.byId[id].value);

  const data: [number, number][] = envelopingIds.map((id) => {
    const weight = weights.byId[id];
    return [new Date(id).getTime(), weight.value];
  });

  const chartVariation: "small" | "medium" | "large" =
    data.length >= 128 ? "large" : data.length >= 48 ? "medium" : "small";

  return (
    <Paper>
      <h3>Weight chart</h3>
      <Chart.LineChart
        centerXAxisLabels={centerXAxisLabels}
        aria-label="Chart displaying weight against time"
        domain={domain}
        range={createChartExtent(envelopingValues)}
        xAxisLabels={xLabels}
        yAxisTitle="Weight (kg)"
      >
        <Chart.Line
          data={data}
          thickness={chartVariation === "medium" ? 2 : undefined}
        />
        {chartVariation === "small" && <Chart.Points data={data} />}
      </Chart.LineChart>
    </Paper>
  );
}
