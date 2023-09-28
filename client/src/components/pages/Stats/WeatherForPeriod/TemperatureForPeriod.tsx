import { Chart } from "eri";
import { convertKelvinToCelcius, createChartExtent } from "../../../../utils";
import useEnvelopingEventIdsWithLocation from "../../../hooks/useEnvelopingEventIdsWithLocation";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

interface Props {
  centerXAxisLabels: boolean;
  dateFrom: Date;
  dateTo: Date;
  xLabels: string[];
}

export default function TemperatureForPeriod({
  centerXAxisLabels,
  dateFrom,
  dateTo,
  xLabels,
}: Props) {
  const envelopingEventIdsWithLocation = useEnvelopingEventIdsWithLocation(
    dateFrom,
    dateTo,
  );
  const weatherResults = useWeatherQueries(envelopingEventIdsWithLocation);

  if (!envelopingEventIdsWithLocation.length) return;

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
  if (chartData.length < 2) return;

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
        centerXAxisLabels={centerXAxisLabels}
        domain={[dateFrom.getTime(), dateTo.getTime()]}
        range={createChartExtent(temperatures)}
        xAxisLabels={xLabels}
        xAxisTitle="Month"
        yAxisTitle="Temperature (°C)"
      >
        <Chart.Line
          data={chartData}
          thickness={chartVariation === "medium" ? 2 : undefined}
        />
        {chartVariation === "small" && <Chart.Points data={chartData} />}
      </Chart.LineChart>
    </>
  );
}
