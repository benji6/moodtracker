import "./style.css";
import { Icon, Spinner } from "eri";
import LocationString from "../../LocationString";
import { formatKelvinToCelcius } from "../../../../formatters/numberFormatters";
import { getWeatherDisplayData } from "../../../../utils";
import { useWeatherQuery } from "../../../hooks/weatherHooks";

interface Props {
  date: Date;
  latitude: number;
  longitude: number;
}

export default function EventCardLocationAndWeather({
  date,
  latitude,
  longitude,
}: Props) {
  const { data, isError, isPending } = useWeatherQuery({
    date,
    latitude,
    longitude,
  });

  if (isError) return;

  if (isPending)
    return (
      <div className="m-event-card-location-and-weather">
        <Spinner margin={false} />
      </div>
    );

  const weatherData = data.data[0];
  const weatherIconData = weatherData?.weather[0];

  const { iconName, weatherColor } = getWeatherDisplayData({
    isDaytime:
      date >= new Date(weatherData.sunrise * 1e3) &&
      date < new Date(weatherData.sunset * 1e3),
    weatherId: weatherIconData.id,
  });

  return (
    <div className="m-event-card-location-and-weather">
      {weatherIconData && (
        <>
          <Icon color={weatherColor} draw name={iconName} size="3" />
          <div>
            {weatherData.temp && formatKelvinToCelcius(weatherData.temp)}
          </div>
        </>
      )}
      {location && (
        <LocationString
          errorFallback={
            <>
              <span className="nowrap">Lat: {latitude}</span>
              <span className="nowrap">Lon: {longitude}</span>
            </>
          }
          latitude={latitude}
          longitude={longitude}
        />
      )}
    </div>
  );
}
