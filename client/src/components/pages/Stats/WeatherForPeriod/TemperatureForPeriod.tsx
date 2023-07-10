import { Chart } from "eri";
import { integerFormatter } from "../../../../formatters/numberFormatters";
import { convertKelvinToCelcius, createChartRange } from "../../../../utils";
import useEnvelopingEventIdsWithLocation from "../../../hooks/useEnvelopingEventIdsWithLocation";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

interface Props {
  dateFrom: Date;
  dateTo: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function TemperatureForPeriod({
  dateFrom,
  dateTo,
  xLabels,
  xLines,
}: Props) {
  const envelopingEventIdsWithLocation = useEnvelopingEventIdsWithLocation(
    dateFrom,
    dateTo,
  );
  const weatherResults = useWeatherQueries(envelopingEventIdsWithLocation);

  if (!envelopingEventIdsWithLocation.length) return null;

  const temperatures: number[] = [];
  const chartData: [number, number][] = [];
  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    const { data } = result;
    if (!data) continue;
    const celcius = convertKelvinToCelcius(data.data[0].temp);
    temperatures.push(celcius);
    chartData.push([
      new Date(envelopingEventIdsWithLocation[i]).getTime(),
      celcius,
    ]);
  }
  if (chartData.length < 2) return null;

  const range = createChartRange(temperatures);
  const yLabels: [number, string][] = [...Array(11).keys()].map((n) => {
    const y = Math.round((n / 10) * (range[1] - range[0]) + range[0]);
    return [y, integerFormatter.format(y)];
  });

  const chartVariation: "small" | "medium" | "large" =
    chartData.length >= 128
      ? "large"
      : chartData.length >= 48
      ? "medium"
      : "small";

  return (
    <>
      <h4>Temperature chart</h4>
      <Chart.LineChart
        aria-label="Chart displaying temperature against time"
        domain={[dateFrom.getTime(), dateTo.getTime()]}
        range={range}
        xAxisTitle="Month"
        yAxisTitle="Temperature (°C)"
      >
        <Chart.XGridLines lines={xLines ?? xLabels.map(([n]) => n)} />
        <Chart.YGridLines lines={yLabels.map(([y]) => y)} />
        <Chart.PlotArea>
          <Chart.Line
            data={chartData}
            thickness={chartVariation === "medium" ? 2 : undefined}
          />
          {chartVariation === "small" && <Chart.Points data={chartData} />}
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers={xLines ?? true} />
        <Chart.YAxis labels={yLabels} markers />
      </Chart.LineChart>
    </>
  );
}
