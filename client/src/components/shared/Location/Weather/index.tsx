import { Paper, Spinner } from "eri";
import { ReactNode } from "react";
import { useQuery } from "react-query";
import { fetchWeather } from "../../../../api";
import { ERRORS } from "../../../../constants";
import { timeFormatter } from "../../../../formatters/dateTimeFormatters";
import {
  celciusFormatter,
  integerDegreeFormatter,
  integerFormatter,
  integerMeterFormatter,
  integerPercentFormatter,
  twoDecimalPlacesFormatter,
} from "../../../../formatters/numberFormatters";
import { capitalizeFirstLetter } from "../../../../utils";
import WeatherIconGrid from "./WeatherIconGrid";

interface Props {
  date: Date;
  latitude: number;
  longitude: number;
}

const kelvinToCelciusString = (n: number): string =>
  celciusFormatter.format(n - 273.15);

export default function Weather({ date, latitude, longitude }: Props) {
  const { data, isError, isLoading } = useQuery(
    ["weather", { date, latitude, longitude }] as const,
    fetchWeather
  );

  const weatherData = data?.data[0];

  return (
    <Paper>
      <h3>Weather</h3>
      {isLoading ? (
        <Spinner />
      ) : isError ? (
        <p className="negative">{ERRORS.network}</p>
      ) : (
        weatherData && (
          <>
            <WeatherIconGrid weatherIconsData={weatherData.weather} />
            <table>
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(weatherData).map(([k, v]) => {
                  if (k === "dt") return null;

                  // This removes the `weather` property
                  // It is done this way to help TypeScript understand the types
                  // It relies on all other properties being numbers (currently true)
                  if (typeof v !== "number") return;

                  let displayKey: ReactNode;
                  switch (k) {
                    case "dew_point":
                      displayKey = (
                        <>
                          Dew point
                          <small>
                            <div>
                              The temperature to which air must be cooled to
                              become saturated with water vapor
                            </div>
                          </small>
                        </>
                      );
                      break;
                    case "pressure":
                      displayKey = (
                        <>
                          Pressure
                          <small>
                            <div>
                              Typical sea-level air pressure is about 1013 hPa
                              &amp; 1 hPa is equal to 1 millibar.
                            </div>
                          </small>
                        </>
                      );
                      break;
                    case "uvi":
                      displayKey = (
                        <>
                          Ultraviolet index
                          <small>
                            <div>
                              The strength of sunburn-producing ultraviolet
                              radiation
                            </div>
                          </small>
                        </>
                      );
                      break;

                    default:
                      displayKey = capitalizeFirstLetter(
                        k.replaceAll("_", " ")
                      );
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
                      displayValue = kelvinToCelciusString(v);
                      break;
                    case "pressure":
                      displayValue = `${integerFormatter.format(v)} hPa`;
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
                      displayValue = `${twoDecimalPlacesFormatter.format(
                        v
                      )} m/s`;
                  }

                  return (
                    <tr key={k}>
                      <td>{displayKey}</td>
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
