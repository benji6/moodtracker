import { Icon, Paper, Spinner } from "eri";
import { ComponentProps } from "react";
import { ERRORS } from "../../../../constants";
import { timeFormatter } from "../../../../formatters/dateTimeFormatters";
import {
  formatKelvinToCelcius,
  integerDegreeFormatter,
  integerFormatter,
  integerMeterFormatter,
  integerPercentFormatter,
  twoDecimalPlacesFormatter,
} from "../../../../formatters/numberFormatters";
import { capitalizeFirstLetter } from "../../../../utils";
import { useWeatherQuery } from "../../../hooks/weatherHooks";
import WeatherIconGrid from "./WeatherIconGrid";

interface Props {
  date: Date;
  latitude: number;
  longitude: number;
}

type Entries<T> = [keyof T, T[keyof T]][];

export default function Weather({ date, latitude, longitude }: Props) {
  const { error, data, isError, isLoading } = useWeatherQuery({
    date,
    latitude,
    longitude,
  });

  const weatherData = data?.data[0];

  return (
    <Paper>
      <h3>Weather</h3>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="negative">
          {
            ERRORS[
              (error instanceof Error && Number(error.message) >= 500) ||
              (error instanceof Error && error.message === "429")
                ? "server"
                : "network"
            ]
          }
        </p>
      ) : (
        weatherData && (
          <>
            <WeatherIconGrid
              daytime={
                date >= new Date(weatherData.sunrise * 1e3) &&
                date < new Date(weatherData.sunset * 1e3)
              }
              weatherIconsData={weatherData.weather}
            />
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {(
                  Object.entries(weatherData) as Entries<typeof weatherData>
                ).map(([k, v]) => {
                  if (k === "dt") return null;

                  // This removes the `weather` property
                  // It is done this way to help TypeScript understand the types
                  // It relies on all other properties being numbers (currently true)
                  if (typeof v !== "number") return;

                  const name =
                    k === "uvi"
                      ? "Ultraviolet index"
                      : capitalizeFirstLetter(k.replaceAll("_", " "));

                  let iconName: ComponentProps<typeof Icon>["name"];
                  if (k === "sunrise" || k === "sunset") iconName = k;
                  else if (k === "clouds") iconName = "cloud";
                  else if (k === "dew_point") iconName = "dew-point";
                  else if (k === "feels_like") iconName = "thermometer";
                  else if (k === "humidity") iconName = "droplet";
                  else if (k === "temp") iconName = "thermometer";
                  else if (k === "uvi") iconName = "sun";
                  else if (k === "visibility") iconName = "eye";
                  else if (k === "wind_deg") iconName = "compass";
                  else if (k === "wind_gust") iconName = "wind";
                  else if (k === "wind_speed") iconName = "wind";
                  else iconName = "chart";

                  let supportiveText: string | undefined = undefined;
                  switch (k) {
                    case "dew_point":
                      supportiveText =
                        "The temperature to which air must be cooled to become saturated with water vapor";
                      break;
                    case "pressure":
                      supportiveText =
                        "Typical sea-level air pressure is about 1013 hPa & 1 hPa is equal to 1 millibar";
                      break;
                    case "uvi":
                      supportiveText =
                        "The strength of sunburn-producing ultraviolet radiation";
                  }

                  let displayValue: number | string = v;
                  switch (k) {
                    case "clouds":
                    case "humidity":
                      displayValue = integerPercentFormatter.format(v / 100);
                      break;
                    case "dew_point":
                    case "feels_like":
                    case "temp":
                      displayValue = formatKelvinToCelcius(v);
                      break;
                    case "pressure":
                      displayValue = `${integerFormatter.format(v)} hPa`;
                      break;
                    case "rain":
                    case "snow":
                      // I haven't seen the actual API data and don't know what precision this number has
                      displayValue = `${integerFormatter.format(v)} mm/hour`;
                      break;
                    case "sunrise":
                    case "sunset":
                      displayValue = timeFormatter.format(new Date(v * 1e3));
                      break;
                    case "visibility":
                      displayValue = integerMeterFormatter.format(v);
                      break;
                    case "wind_deg":
                      displayValue = integerDegreeFormatter.format(v);
                      break;
                    case "wind_speed":
                    case "wind_gust":
                      displayValue = `${twoDecimalPlacesFormatter.format(
                        v,
                      )} m/s`;
                  }

                  return (
                    <tr key={k}>
                      <td>
                        <Icon margin="end" name={iconName} />
                        {name}
                        {supportiveText && (
                          <small>
                            <div>{supportiveText}</div>
                          </small>
                        )}
                      </td>
                      <td className="nowrap">{displayValue}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </>
        )
      )}
    </Paper>
  );
}
