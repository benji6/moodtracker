import { Card } from "eri";
import { capitalizeFirstLetter } from "../../../../../../utils";
import "./style.css";

interface Props {
  description: string;
  icon: string;
  main: string;
}

export default function WeatherIconCard({ description, icon, main }: Props) {
  return (
    <Card>
      <div className="m-weather-icon-card">
        <b>{main}</b>
        <img
          alt=""
          className="m-0 m-weather-icon-card__img"
          src={`https://openweathermap.org/img/wn/${icon}@2x.png`}
        />
        <small>{capitalizeFirstLetter(description)}</small>
      </div>
    </Card>
  );
}
