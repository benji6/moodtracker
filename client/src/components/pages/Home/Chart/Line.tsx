import * as React from "react";
import { ILine } from "./types";
import { LINE_WIDTH, POINT_RADIUS, CHART_ASPECT_RATIO } from "./constants";

export default function Line([point0, point1]: ILine) {
  return (
    <line
      stroke="var(--e-color-theme)"
      strokeWidth={LINE_WIDTH}
      x1={point0.x * CHART_ASPECT_RATIO * (1 - POINT_RADIUS) + POINT_RADIUS}
      y1={(1 - point0.y) * (1 - POINT_RADIUS) + POINT_RADIUS}
      x2={point1.x * CHART_ASPECT_RATIO * (1 - POINT_RADIUS) + POINT_RADIUS}
      y2={(1 - point1.y) * (1 - POINT_RADIUS) + POINT_RADIUS}
    />
  );
}
