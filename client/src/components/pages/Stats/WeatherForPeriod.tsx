import { useQueries } from "@tanstack/react-query";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import { ComponentProps } from "react";
import { useSelector } from "react-redux";
import { fetchWeather } from "../../../api";
import { WEATHER_QUERY_OPTIONS } from "../../../constants";
import {
  integerPercentFormatter,
  oneDecimalPlaceFormatter,
} from "../../../formatters/numberFormatters";
import {
  eventsAllIdsSelector,
  eventsByIdSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import { DeviceGeolocation } from "../../../types";
import {
  getIdsInInterval,
  getWeatherIconAndColor,
  moodToColor,
} from "../../../utils";
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
  const normalizedMoods = useSelector(normalizedMoodsSelector);
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
    queries: locationByIdEntries.map(([id, location]) => ({
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
    })),
  });

  if (!locationByIdEntries.length) return null;

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;

  const chartData: {
    [nameAndColor: string]: {
      locationEventCount: number;
      moodCount: number;
      sumOfMoods: number;
    };
  } = {};

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
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
      const eventId = locationByIdEntries[i][0];
      const mood =
        eventId in normalizedMoods.byId
          ? normalizedMoods.byId[eventId]
          : undefined;

      const moodToAddToSum = mood ? mood.mood : 0;
      const addToMoodCount = Number(mood !== undefined);
      chartData[key] =
        key in chartData
          ? {
              locationEventCount: chartData[key].locationEventCount + 1,
              moodCount: chartData[key].moodCount + addToMoodCount,
              sumOfMoods: chartData[key].sumOfMoods + moodToAddToSum,
            }
          : {
              locationEventCount: 1,
              moodCount: addToMoodCount,
              sumOfMoods: moodToAddToSum,
            };
    }
  }

  const frequencyChartData = Object.entries(chartData)
    .map(([key, { locationEventCount }]) => {
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
        title: `${main}: ${locationEventCount}`,
        y: locationEventCount,
      };
    })
    .sort((a, b) => {
      const yDifference = b.y - a.y;
      return yDifference || a.main.localeCompare(b.main);
    });

  const meanMoodChartData = Object.entries(chartData)
    .map(([key, { moodCount, sumOfMoods }]) => {
      const [main, iconName, color] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      const meanMood = sumOfMoods / moodCount;
      return {
        color: moodToColor(meanMood),
        iconName,
        key,
        label: (
          <>
            <Icon color={color} draw name={iconName} />
            {main}
          </>
        ),
        main,
        title: `${main}: ${oneDecimalPlaceFormatter.format(meanMood)}`,
        y: meanMood,
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
      {frequencyChartData.length && (
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
      )}
      {meanMoodChartData.length && (
        <>
          <h4>Average mood by weather</h4>
          <ColumnChart
            aria-label="Chart displaying average mood for different weather types"
            data={meanMoodChartData}
            rotateXLabels
            xAxisTitle="Weather"
            yAxisTitle="Average mood"
          />
        </>
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
