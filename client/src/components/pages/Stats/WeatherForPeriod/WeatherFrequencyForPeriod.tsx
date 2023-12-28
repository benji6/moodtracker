import { Chart, Icon } from "eri";
import { ComponentProps } from "react";
import { RootState } from "../../../../store";
import eventsSlice from "../../../../store/eventsSlice";
import { getWeatherDisplayData } from "../../../../utils";
import { useSelector } from "react-redux";
import { useWeatherQueries } from "../../../hooks/weatherHooks";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function WeatherFrequencyForPeriod({ dateFrom, dateTo }: Props) {
  const eventIdsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.idsWithLocationInPeriod(state, dateFrom, dateTo),
  );
  const weatherResults = useWeatherQueries(eventIdsWithLocationInPeriod);

  if (!eventIdsWithLocationInPeriod.length) return;

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

  if (!frequencyChartData.length) return;

  return (
    <>
      <h4>Weather frequency</h4>
      <Chart.ColumnChart
        aria-label="Chart displaying the frequency at which different weather types were recorded"
        data={frequencyChartData}
        rotateXLabels
        xAxisTitle="Weather"
        yAxisTitle="Count"
      />
    </>
  );
}
