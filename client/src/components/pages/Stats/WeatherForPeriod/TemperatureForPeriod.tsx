import { Chart, Paper } from "eri";
import { convertKelvinToCelcius, createChartExtent } from "../../../../utils";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import WeatherLoadingStatus from "./WeatherLoadingStatus";

interface Props {
  centerXAxisLabels: boolean;
  dateFrom: Date;
  dateTo: Date;
  eventIds: string[];
  weatherResultsData: UseQueryResult<WeatherApiResponse, Error>["data"][];
  weatherResultStatuses: UseQueryResult<WeatherApiResponse, Error>["status"][];
  xLabels: string[];
}

export default function TemperatureForPeriod({
  centerXAxisLabels,
  dateFrom,
  dateTo,
  eventIds,
  weatherResultsData,
  weatherResultStatuses,
  xLabels,
}: Props) {
  if (!eventIds.length) return;

  const temperatures: number[] = [];
  const chartData: [number, number][] = [];
  for (let i = 0; i < weatherResultsData.length; i++) {
    const data = weatherResultsData[i];
    if (!data) continue;
    const celcius = convertKelvinToCelcius(data.data[0].temp);
    temperatures.push(celcius);
    chartData.push([new Date(eventIds[i]).getTime(), celcius]);
  }
  if (chartData.length < 2) return;

  const chartVariation: "small" | "medium" | "large" =
    chartData.length >= 128
      ? "large"
      : chartData.length >= 48
        ? "medium"
        : "small";

  return (
    <Paper>
      <h3>Temperature chart</h3>
      <Chart.LineChart
        aria-label="Chart displaying temperature against time"
        centerXAxisLabels={centerXAxisLabels}
        domain={[dateFrom.getTime(), dateTo.getTime()]}
        points={
          chartVariation === "small"
            ? chartData.map(([x, y]) => ({ x, y }))
            : undefined
        }
        range={createChartExtent(temperatures)}
        xAxisLabels={xLabels}
        xAxisTitle="Month"
        yAxisTitle="Temperature (°C)"
      >
        <Chart.Line
          data={chartData}
          thickness={chartVariation === "medium" ? 2 : undefined}
        />
      </Chart.LineChart>
      <WeatherLoadingStatus weatherResultStatuses={weatherResultStatuses} />
    </Paper>
  );
}
