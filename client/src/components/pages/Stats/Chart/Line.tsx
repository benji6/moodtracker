import * as React from "react";
import { LINE_WIDTH_1, PLOT_ASPECT_RATIO } from "./constants";
import { TPoint } from "./types";

interface Props {
  color?: string;
  points: TPoint[];
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
    const x = point[0] * PLOT_ASPECT_RATIO;
    const y = 1 - point[1];
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
