import { Chart, Icon, Paper, SubHeading } from "eri";
import { ComponentProps } from "react";
import { MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS } from "./constants";
import { UseQueryResult } from "@tanstack/react-query";
import { WeatherApiResponse } from "../../../../types";
import WeatherLoadingStatus from "./WeatherLoadingStatus";
import { getWeatherDisplayData } from "../../../../utils";

interface Props {
  eventIds: string[];
  weatherResultsData: UseQueryResult<WeatherApiResponse, Error>["data"][];
  weatherResultStatuses: UseQueryResult<WeatherApiResponse, Error>["status"][];
}

export default function WeatherFrequencyForPeriod({
  eventIds,
  weatherResultsData,
  weatherResultStatuses,
}: Props) {
  if (!eventIds.length) return;

  const chartData: Record<string, number> = {};
  for (const data of weatherResultsData) {
    if (!data) continue;
    const [weatherData] = data.data;
    for (const { id: weatherId } of weatherData.weather) {
      const { iconName, label, weatherColor } = getWeatherDisplayData({
        isDaytime: true,
        weatherId,
      });
      const key = `${label}:${iconName}:${weatherColor}`;
      chartData[key] = key in chartData ? chartData[key] + 1 : 1;
    }
  }

  const frequencyChartData = Object.entries(chartData)
    .map(([key, count]) => {
      const [label, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string,
      ];
      return {
        color,
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {label}
          </>
        ),
        text: label,
        title: `${label}: ${count}`,
        y: count,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.text.localeCompare(b.text);
    });

  return (
    <Paper>
      <h3>
        Weather frequency
        <SubHeading>
          {eventIds.length} location
          {eventIds.length > 1 ? "s" : ""} recorded for this period
          {eventIds.length < MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS && (
            <>
              {" "}
              (some weather charts will not be visible unless you have at least{" "}
              {MINIMUM_LOCATION_COUNT_FOR_MEAN_CHARTS} locations)
            </>
          )}
        </SubHeading>
      </h3>
      {Boolean(frequencyChartData.length) && (
        <Chart.ColumnChart
          aria-label="Chart displaying the frequency at which different weather types were recorded"
          data={frequencyChartData}
          rotateXLabels
          xAxisTitle="Weather"
          yAxisTitle="Count"
        />
      )}
      <WeatherLoadingStatus weatherResultStatuses={weatherResultStatuses} />
    </Paper>
  );
}
