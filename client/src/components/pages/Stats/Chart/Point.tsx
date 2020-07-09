import * as React from "react";
import { POINT_RADIUS, CHART_ASPECT_RATIO } from "./constants";
import { moodToColor } from "../../../../utils";

interface Props {
  x: number;
  y: number;
}

export default function Point({ x, y }: Props) {
  return (
    <circle
      cx={x * CHART_ASPECT_RATIO * (1 - POINT_RADIUS) + POINT_RADIUS}
      cy={(1 - y) * (1 - POINT_RADIUS) + POINT_RADIUS}
      fill={moodToColor(y)}
      r={POINT_RADIUS}
    />
  );
}
