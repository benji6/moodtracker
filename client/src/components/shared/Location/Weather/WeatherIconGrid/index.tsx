import { WeatherApiResponse } from "../../../../../types";
import WeatherIconCard from "./WeatherIconCard";
import "./style.css";

interface Props {
  weatherIconsData: WeatherApiResponse["data"][0]["weather"];
}

export default function WeatherIconGrid({ weatherIconsData }: Props) {
  if (!weatherIconsData.length) return null;

  return (
    <div className="m-weather-icon-grid">
      {weatherIconsData.map((weather) => (
        <WeatherIconCard key={weather.id} {...weather} />
      ))}
    </div>
  );
}
