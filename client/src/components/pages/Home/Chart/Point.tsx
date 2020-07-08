import { interpolatePlasma } from "d3-scale-chromatic";
import * as React from "react";
import { POINT_RADIUS, CHART_ASPECT_RATIO } from "./constants";

let colorCache = new Map();

const getColor = (n: number): string => {
  const cachedColor = colorCache.get(n);
  if (cachedColor) return cachedColor;
  const color = interpolatePlasma(n * 0.75);
  colorCache.set(n, color);
  return color;
};

interface Props {
  x: number;
  y: number;
}

export default function Point({ x, y }: Props) {
  return (
    <circle
      cx={x * CHART_ASPECT_RATIO * (1 - POINT_RADIUS) + POINT_RADIUS}
      cy={(1 - y) * (1 - POINT_RADIUS) + POINT_RADIUS}
      fill={getColor(y)}
      r={POINT_RADIUS}
    />
  );
}
