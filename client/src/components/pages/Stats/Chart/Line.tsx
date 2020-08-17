import * as React from "react";
import { TPoint } from "./types";
import { LINE_WIDTH_1, POINT_RADIUS, CHART_ASPECT_RATIO } from "./constants";

interface Props {
  color?: string;
  points: readonly TPoint[];
  thickness?: number;
}

export default function Line({
  color = "var(--e-color-theme)",
  points,
  thickness = LINE_WIDTH_1,
}: Props) {
  if (points.length < 2) return null;

  let polylinePoints = "";

  for (const point of points) {
    const x =
      point[0] * CHART_ASPECT_RATIO * (1 - POINT_RADIUS * 2) + POINT_RADIUS;
    const y = (1 - point[1]) * (1 - POINT_RADIUS) + POINT_RADIUS;
    polylinePoints += `${x},${y} `;
  }

  polylinePoints = polylinePoints.trimRight();

  return (
    <polyline
      fill="none"
      points={polylinePoints}
      stroke={color}
      strokeWidth={thickness}
    />
  );
}
