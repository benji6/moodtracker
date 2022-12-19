import { useQueries } from "@tanstack/react-query";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import { fetchWeather } from "../../../api";
import { WEATHER_QUERY_OPTIONS } from "../../../constants";
import { integerPercentFormatter } from "../../../formatters/numberFormatters";
import { eventsAllIdsSelector, eventsByIdSelector } from "../../../selectors";
import { DeviceGeolocation } from "../../../types";
import { getIdsInInterval, getWeatherIconAndColor } from "../../../utils";
import ColumnChart from "../../shared/ColumnChart";

type QueryKey = [
  "weather",
  { date: Date; latitude: number; longitude: number }
];

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function WeatherForPeriod({ fromDate, toDate }: Props) {
  const eventsAllIds = useSelector(eventsAllIdsSelector);
  const eventsById = useSelector(eventsByIdSelector);
  const eventIdsInPeriod = getIdsInInterval(eventsAllIds, fromDate, toDate);

  const locationByIdEntries: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsInPeriod) {
    const event = eventsById[id];
    if (
      typeof event.payload !== "string" &&
      "location" in event.payload &&
      event.payload.location
    )
      locationByIdEntries.push([id, event.payload.location]);
  }

  const results = useQueries({
    queries: locationByIdEntries.reduce(
      (
        queries: {
          queryFn: typeof fetchWeather;
          queryKey: QueryKey;
        }[],
        [id, location]
      ) => {
        return [
          ...queries,
          {
            ...WEATHER_QUERY_OPTIONS,
            queryKey: [
              "weather",
              {
                date: new Date(id),
                latitude: location.latitude,
                longitude: location.longitude,
              },
            ] as QueryKey,
            queryFn: fetchWeather,
          },
        ];
      },
      []
    ),
  });

  if (!locationByIdEntries.length) return null;

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;

  const chartData: {
    [nameAndColor: string]: number;
  } = {};

  for (const result of results) {
    if (result.isError) errorCount++;
    else if (result.isLoading) loadingCount++;
    const data = result.data;
    if (!data) continue;
    successCount++;
    const [weatherData] = data.data;
    for (let j = 0; j < weatherData.weather.length; j++) {
      const { iconName, weatherColor } = getWeatherIconAndColor({
        isDaytime: true,
        weatherId: weatherData.weather[j].id,
      });
      const { main } = weatherData.weather[j];
      const key = `${main}:${iconName}:${weatherColor}`;
      chartData[key] = key in chartData ? chartData[key] + 1 : 1;
    }
  }

  const dataToRender = Object.entries(chartData)
    .map(([key, count]) => {
      const [main, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      return {
        color,
        iconName,
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {main}
          </>
        ),
        main,
        title: `${main}: ${count}`,
        y: count,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.main.localeCompare(b.main);
    });

  return (
    <Paper>
      <h3>
        Weather
        <SubHeading>
          {locationByIdEntries.length} location
          {locationByIdEntries.length > 1 ? "s" : ""} recorded for this period
        </SubHeading>
      </h3>
      {dataToRender.length && (
        <ColumnChart
          aria-label="Chart displaying the frequency at which different weather types were recorded"
          data={dataToRender}
          rotateXLabels
          xAxisTitle="Weather"
          yAxisTitle="Count"
        />
      )}
      {loadingCount || errorCount ? (
        <p>
          <small>
            {Boolean(loadingCount) && (
              <>
                <Spinner inline margin="end" />
                Fetching weather data (may require an internet connection)...{" "}
                {integerPercentFormatter.format(
                  successCount / locationByIdEntries.length
                )}
              </>
            )}
            {Boolean(errorCount && loadingCount) && <br />}
            {Boolean(errorCount) && (
              <span className="negative">
                Could not fetch weather for{" "}
                {integerPercentFormatter.format(
                  errorCount / locationByIdEntries.length
                )}{" "}
                of locations, please try again later
              </span>
            )}
          </small>
        </p>
      ) : null}
    </Paper>
  );
}
