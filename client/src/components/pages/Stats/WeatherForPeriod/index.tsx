import { useQueries } from "@tanstack/react-query";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import { ComponentProps, CSSProperties, Fragment } from "react";
import { useSelector } from "react-redux";
import { fetchWeather } from "../../../../api";
import { WEATHER_QUERY_OPTIONS } from "../../../../constants";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import {
  eventsAllIdsSelector,
  eventsByIdSelector,
} from "../../../../selectors";
import { DeviceGeolocation, WeatherApiResponse } from "../../../../types";
import {
  getIdsInInterval,
  getWeatherIconAndColor,
  roundUpToNearest10,
} from "../../../../utils";
import "./style.css";

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
    // TODO react-query types might be fixed one day
    const data = result.data as WeatherApiResponse | undefined;
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

  const maxCount = Math.max(...Object.values(chartData));
  const range: [number, number] = [0, roundUpToNearest10(maxCount)];

  const yLabels: number[] =
    range[1] <= 10
      ? [...Array(range[1] + 1).keys()]
      : [...Array(11).keys()].map((n) => Math.round((n / 10) * range[1]));

  const dataToRender = Object.entries(chartData)
    .map(([key, count]) => {
      const [main, iconName, weatherColor] = key.split(":") as [
        string,
        ComponentProps<typeof Icon>["name"],
        string
      ];
      return { count, iconName, key, main, weatherColor };
    })
    .sort((a, b) => {
      const countDifference = b.count - a.count;
      return countDifference || a.main.localeCompare(b.main);
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
        <div
          className="column-chart"
          aria-label="Chart displaying the frequency at which different weather types were recorded"
          style={{ "--column-count": dataToRender.length } as CSSProperties}
        >
          <div className="grid-lines">
            {yLabels.slice(1).map((x) => (
              <div key={x} />
            ))}
          </div>
          <div className="y-title fade-in">Count</div>
          <div className="x-title fade-in">Weather</div>
          <div className="x-label" />
          <div
            className="y-axis"
            style={{ "--y-label-count": yLabels.length } as CSSProperties}
          >
            {yLabels.map((yLabel, i) => (
              <div
                className="y-label fade-in"
                key={yLabel}
                style={{ "--y-label-number": i } as CSSProperties}
              >
                {yLabel}
              </div>
            ))}
          </div>
          <div className="x-label" />
          {dataToRender.map(
            ({ count, key, iconName, main, weatherColor }, i) => {
              const title = `${main}: ${count}`;
              return (
                <Fragment key={key}>
                  <div
                    className="column"
                    title={title}
                    style={
                      {
                        color: weatherColor,
                        "--column-height": `${(100 * count) / range[1]}%`,
                        "--column-number": i,
                      } as CSSProperties
                    }
                  />
                  <div
                    className="x-label"
                    style={
                      {
                        "--x-label-number": i,
                      } as CSSProperties
                    }
                    title={title}
                  >
                    <Icon color={weatherColor} draw name={iconName} />
                    {main}
                  </div>
                </Fragment>
              );
            }
          )}
        </div>
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
