import { Card, Icon } from "eri";
import { capitalizeFirstLetter } from "../../../../../../utils";
import "./style.css";

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
  let color = "var(--color-balance-more)";
  let iconName: React.ComponentProps<typeof Icon>["name"] = "cloud";

  if (id < 300) {
    color = "var(--color-figure-more)";
    iconName = "lightning";
  } else if (id < 400) {
    color = "steelblue";
    iconName = "drizzle";
  } else if (id < 600) {
    color = "blue";
    iconName = "rain";
  } else if (id < 700) iconName = "snow";
  else if (id < 800) iconName = "menu";
  else if (id === 800) {
    if (daytime) {
      color = "orange";
      iconName = "sun";
    } else {
      color = "rebeccapurple";
      iconName = "moon";
    }
  } else if (id < 803) {
    if (daytime) {
      color = "orange";
      iconName = "partly-cloudy-day";
    } else {
      color = "rebeccapurple";
      iconName = "partly-cloudy-night";
    }
  }

  return (
    <Card color={color}>
      <div className="m-weather-icon-card">
        <b>{main}</b>
        <Icon color={color} draw name={iconName} size="4" />
        <small>{capitalizeFirstLetter(description)}</small>
      </div>
    </Card>
  );
}
