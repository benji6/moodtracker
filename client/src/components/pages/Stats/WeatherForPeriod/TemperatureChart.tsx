import { Chart } from "eri";
import { integerFormatter } from "../../../../formatters/numberFormatters";
import { convertKelvinToCelcius, createChartRange } from "../../../../utils";
import useEnvelopingEventIdsWithLocation from "../../../hooks/useEnvelopingEventIdsWithLocation";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";

interface Props {
  fromDate: Date;
  toDate: Date;
  xLabels: [number, string][];
  xLines?: number[];
}

export default function TemperatureChart({
  fromDate,
  toDate,
  xLabels,
  xLines,
}: Props) {
  const envelopingEventIdsWithLocation = useEnvelopingEventIdsWithLocation(
    fromDate,
    toDate
  );
  const weatherResults = useWeatherQueries(envelopingEventIdsWithLocation);

  if (!envelopingEventIdsWithLocation.length) return null;

  const temperatures: number[] = [];
  const temperatureChartData: [number, number][] = [];
  for (let i = 0; i < weatherResults.length; i++) {
    const result = weatherResults[i];
    const { data } = result;
    if (!data) continue;
    const celcius = convertKelvinToCelcius(data.data[0].temp);
    temperatures.push(celcius);
    temperatureChartData.push([
      new Date(envelopingEventIdsWithLocation[i]).getTime(),
      celcius,
    ]);
  }
  if (!temperatureChartData.length) return null;

  const temperatureChartRange = createChartRange(temperatures);
  const temperatureChartYLabels: [number, string][] = [...Array(11).keys()].map(
    (n) => {
      const y = Math.round(
        (n / 10) * (temperatureChartRange[1] - temperatureChartRange[0]) +
          temperatureChartRange[0]
      );
      return [y, integerFormatter.format(y)];
    }
  );

  const temperatureChartVariation: "small" | "medium" | "large" =
    temperatureChartData.length >= 128
      ? "large"
      : temperatureChartData.length >= 48
      ? "medium"
      : "small";

  return (
    <>
      <h3>Temperature chart</h3>
      <Chart.LineChart
        aria-label="Chart displaying temperature against time"
        domain={[fromDate.getTime(), toDate.getTime()]}
        range={temperatureChartRange}
        yAxisTitle="Temperature (°C)"
      >
        <Chart.XGridLines lines={xLines ?? xLabels.map(([n]) => n)} />
        <Chart.YGridLines lines={temperatureChartYLabels.map(([y]) => y)} />
        <Chart.PlotArea>
          <Chart.Line
            data={temperatureChartData}
            thickness={temperatureChartVariation === "medium" ? 2 : undefined}
          />
          {temperatureChartVariation === "small" && (
            <Chart.Points data={temperatureChartData} />
          )}
        </Chart.PlotArea>
        <Chart.XAxis labels={xLabels} markers={xLines ?? true} />
        <Chart.YAxis labels={temperatureChartYLabels} markers />
      </Chart.LineChart>
    </>
  );
}
