import "./style.css";
import { Card, Icon } from "eri";
import {
  capitalizeFirstLetter,
  getWeatherDisplayData,
} from "../../../../../../utils";

interface Props {
  daytime: boolean;
  description: string;
  id: number;
  main: string;
}

export default function WeatherIconCard({
  daytime,
  description,
  id,
  main,
}: Props) {
  const { iconName, weatherColor } = getWeatherDisplayData({
    isDaytime: daytime,
    weatherId: id,
  });

  return (
    <Card color={weatherColor}>
      <div className="m-weather-icon-card">
        <b>{main}</b>
        <Icon color={weatherColor} draw name={iconName} size="4" />
        <small>{capitalizeFirstLetter(description)}</small>
      </div>
    </Card>
  );
}
