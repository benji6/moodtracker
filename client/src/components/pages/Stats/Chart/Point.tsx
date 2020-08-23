import * as React from "react";
import { POINT_RADIUS, PLOT_ASPECT_RATIO } from "./constants";
import { moodToColor } from "../../../../utils";

interface Props {
  x: number;
  y: number;
}

export default function Point({ x, y }: Props) {
  return (
    <circle
      cx={x * PLOT_ASPECT_RATIO}
      cy={1 - y}
      fill={moodToColor(y)}
      r={POINT_RADIUS}
    />
  );
}
