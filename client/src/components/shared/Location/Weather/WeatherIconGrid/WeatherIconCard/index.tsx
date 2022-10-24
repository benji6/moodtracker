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
  let iconName: React.ComponentProps<typeof Icon>["name"];
  if (id < 300) iconName = "lightning";
  else if (id < 400) iconName = "drizzle";
  else if (id < 600) iconName = "rain";
  else if (id < 700) iconName = "snow";
  else if (id < 800) iconName = "menu";
  else if (id < 802) iconName = daytime ? "sun" : "moon";
  else iconName = "cloud";

  return (
    <Card>
      <div className="m-weather-icon-card">
        <b>{main}</b>
        <Icon draw name={iconName} size="4" />
        <small>{capitalizeFirstLetter(description)}</small>
      </div>
    </Card>
  );
}
