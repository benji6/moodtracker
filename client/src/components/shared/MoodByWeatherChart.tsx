import { Icon } from "eri";
import { ComponentProps } from "react";
import { MOOD_EXTENT } from "../../constants";
import ColumnChart from "./ColumnChart";

interface Props {
  data: {
    iconName: ComponentProps<typeof Icon>["name"];
    key: string;
    labelText: string;
    moodColor: string;
    title: string;
    weatherColor: string;
    y: number;
  }[];
}

export default function MoodByWeatherChart({ data }: Props) {
  return (
    <>
      <h4>Average mood by weather</h4>
      <ColumnChart
        aria-label="Chart displaying average mood for different weather types"
        data={data.map(
          ({
            iconName,
            key,
            labelText,
            moodColor,
            title,
            weatherColor,
            y,
          }) => ({
            color: moodColor,
            key,
            label: (
              <>
                <Icon color={weatherColor} draw name={iconName} />
                {labelText}
              </>
            ),
            title,
            y,
          }),
        )}
        maxRange={MOOD_EXTENT}
        rotateXLabels
        xAxisTitle="Weather"
        yAxisTitle="Average mood"
      />
    </>
  );
}
