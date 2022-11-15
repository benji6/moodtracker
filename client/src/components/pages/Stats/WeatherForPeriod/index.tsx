import { useQueries } from "@tanstack/react-query";
import { Icon, Paper, Spinner, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { fetchWeather } from "../../../../api";
import { WEATHER_QUERY_OPTIONS } from "../../../../constants";
import { integerPercentFormatter } from "../../../../formatters/numberFormatters";
import { eventsSelector } from "../../../../selectors";
import { DeviceGeolocation, WeatherApiResponse } from "../../../../types";
import { getIdsInInterval, getWeatherIconAndColor } from "../../../../utils";
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
  const events = useSelector(eventsSelector);
  const eventIdsInPeriod = getIdsInInterval(events.allIds, fromDate, toDate);

  const locationByIdEntries: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsInPeriod) {
    const event = events.byId[id];
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

  const iconParams: {
    iconName: React.ComponentProps<typeof Icon>["name"];
    key: string;
    weatherColor: string;
  }[] = [];

  let errorCount = 0;
  let loadingCount = 0;
  let successCount = 0;

  for (let i = 0; i < results.length; i++) {
    const result = results[i];
    if (result.isError) errorCount++;
    else if (result.isLoading) loadingCount++;
    // TODO react-query types might be fixed one day
    const data = result.data as WeatherApiResponse | undefined;
    if (!data) continue;
    successCount++;
    const [weatherData] = data.data;
    const [id] = locationByIdEntries[i];
    const date = new Date(id);
    const isDaytime =
      date >= new Date(weatherData.sunrise * 1e3) &&
      date < new Date(weatherData.sunset * 1e3);

    for (let j = 0; j < weatherData.weather.length; j++) {
      iconParams.push({
        ...getWeatherIconAndColor({
          isDaytime,
          weatherId: weatherData.weather[j].id,
        }),
        key: `${id}:${j}`,
      });
    }
  }

  return (
    <Paper>
      <h3>
        Weather
        <SubHeading>
          {locationByIdEntries.length} location
          {locationByIdEntries.length > 1 ? "s" : ""} recorded for this period
        </SubHeading>
      </h3>
      {iconParams.length && (
        <div
          className="weather-for-period__icons"
          style={{
            fontSize: `${4 - Math.min((3.2 * iconParams.length) / 64, 3.2)}em`,
          }}
        >
          {iconParams.map(({ iconName, key, weatherColor }) => (
            <Icon color={weatherColor} key={key} name={iconName} />
          ))}
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
