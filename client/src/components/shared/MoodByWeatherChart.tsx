import { ComponentProps } from "react";
import { MOOD_EXTENT } from "../../constants";
import ColumnChart from "./ColumnChart";

interface Props {
  data: ComponentProps<typeof ColumnChart>["data"];
}

export default function MoodByWeatherChart({ data }: Props) {
  return (
    <>
      <h4>Average mood by weather</h4>
      <ColumnChart
        aria-label="Chart displaying average mood for different weather types"
        data={data}
        maxRange={MOOD_EXTENT}
        rotateXLabels
        xAxisTitle="Weather"
        yAxisTitle="Average mood"
      />
    </>
  );
}
