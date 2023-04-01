import { Icon, Spinner } from "eri";
import { formatKelvinToCelcius } from "../../../../formatters/numberFormatters";
import { getWeatherDisplayData } from "../../../../utils";
import { useWeatherQuery } from "../../../hooks/weatherHooks";
import "./style.css";

interface Props {
  date: Date;
  latitude: number;
  longitude: number;
}

export default function MoodCardWeather({ date, latitude, longitude }: Props) {
  const { data, isError, isLoading } = useWeatherQuery({
    date,
    latitude,
    longitude,
  });

  if (isError) return null;

  if (isLoading)
    return (
      <div className="m-mood-card-weather m-mood-card-weather--spinner">
        <Spinner margin={false} />
      </div>
    );

  const weatherData = data!.data[0];
  const weatherIconData = weatherData?.weather[0];

  const { iconName, weatherColor } = getWeatherDisplayData({
    isDaytime:
      date >= new Date(weatherData.sunrise * 1e3) &&
      date < new Date(weatherData.sunset * 1e3),
    weatherId: weatherIconData.id,
  });

  return (
    <div className="m-mood-card-weather">
      {weatherIconData && (
        <>
          <Icon color={weatherColor} draw name={iconName} size="3" />
          <div>
            {weatherData.temp && formatKelvinToCelcius(weatherData.temp)}
          </div>
        </>
      )}
    </div>
  );
}
