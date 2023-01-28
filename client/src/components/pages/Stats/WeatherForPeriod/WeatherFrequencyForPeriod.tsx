import { Icon } from "eri";
import { ComponentProps } from "react";
import { getWeatherDisplayData } from "../../../../utils";
import useEventIdsWithLocationInPeriod from "../../../hooks/useEventIdsWithLocationInPeriod";
import { useWeatherQueries } from "../../../hooks/useWeatherQueries";
import ColumnChart from "../../../shared/ColumnChart";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function WeatherFrequencyForPeriod({ dateFrom, dateTo }: Props) {
  const eventIdsWithLocationInPeriod = useEventIdsWithLocationInPeriod(
    dateFrom,
    dateTo
  );
  const weatherResults = useWeatherQueries(eventIdsWithLocationInPeriod);

  if (!eventIdsWithLocationInPeriod.length) return null;

  const chartData: { [nameAndColor: string]: number } = {};
  for (const { data } of weatherResults) {
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
        string
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

  if (!frequencyChartData.length) return null;

  return (
    <>
      <h4>Weather frequency</h4>
      <ColumnChart
        aria-label="Chart displaying the frequency at which different weather types were recorded"
        data={frequencyChartData}
        rotateXLabels
        xAxisTitle="Weather"
        yAxisTitle="Count"
      />
    </>
  );
}