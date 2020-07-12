import * as React from "react";
import { IPoint } from "./types";
import { LINE_WIDTH, POINT_RADIUS, CHART_ASPECT_RATIO } from "./constants";

interface Props {
  points: IPoint[];
}

export default function Line({ points }: Props) {
  if (points.length < 2) return null;

  let polylinePoints = "";

  for (const point of points) {
    const x = point.x * CHART_ASPECT_RATIO * (1 - POINT_RADIUS) + POINT_RADIUS;
    const y = (1 - point.y) * (1 - POINT_RADIUS) + POINT_RADIUS;
    polylinePoints += `${x},${y} `;
  }

  polylinePoints = polylinePoints.trimRight();

  return (
    <polyline
      fill="none"
      points={polylinePoints}
      stroke="var(--e-color-theme)"
      strokeWidth={LINE_WIDTH}
    />
  );
}
