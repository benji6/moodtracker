import { Paper, Spinner } from "eri";
import { ERRORS } from "../../../../constants";
import WeatherIconGrid from "./WeatherIconGrid";
import { useWeatherQuery } from "../../../hooks/weatherHooks";
import WeatherTableRow from "./WeatherTableRow";
import getDataForRenderingWeather from "./getDataForRenderingWeather";

interface Props {
  date: Date;
  latitude: number;
  longitude: number;
}

export default function Weather({ date, latitude, longitude }: Props) {
  const { error, data, isError, isPending } = useWeatherQuery({
    date,
    latitude,
    longitude,
  });

  const weatherData = data?.data[0];

  return (
    <Paper>
      <h3>Weather</h3>
      {isPending ? (
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
                {getDataForRenderingWeather(weatherData).map(
                  ({ displayValue, iconName, name, supportiveText }) => (
                    <WeatherTableRow
                      displayValue={displayValue}
                      iconName={iconName}
                      key={name}
                      name={name}
                      supportiveText={supportiveText}
                    />
                  ),
                )}
              </tbody>
            </table>
          </>
        )
      )}
    </Paper>
  );
}
