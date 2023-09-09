import { WeatherApiResponse } from "../../../../../types";
import WeatherIconCard from "./WeatherIconCard";
import "./style.css";

interface Props {
  weatherIconsData: WeatherApiResponse["data"][0]["weather"];
  daytime: boolean;
}

export default function WeatherIconGrid({ daytime, weatherIconsData }: Props) {
  if (!weatherIconsData.length) return;

  return (
    <div className="m-weather-icon-grid">
      {weatherIconsData.map((weather) => (
        <WeatherIconCard key={weather.id} daytime={daytime} {...weather} />
      ))}
    </div>
  );
}
