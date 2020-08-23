import * as React from "react";
import { PLOT_ASPECT_RATIO, POINT_RADIUS } from "./constants";

interface Props {
  color?: string;
  x: number;
  y: number;
}

export default function Point({ color = "var(--e-color-theme)", x, y }: Props) {
  return (
    <circle
      cx={x * PLOT_ASPECT_RATIO}
      cy={1 - y}
      fill={color}
      r={POINT_RADIUS}
    />
  );
}
