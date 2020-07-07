import { interpolatePlasma } from "d3-scale-chromatic";
import * as React from "react";
import { POINT_SIZE } from "./constants";

let colorCache = new Map();

const getColor = (n: number): string => {
  const cachedColor = colorCache.get(n);
  if (cachedColor) return cachedColor;
  const color = interpolatePlasma(n * 0.75);
  colorCache.set(n, color);
  return color;
};

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  x: number;
  y: number;
}

export default function Point({ x, y, ...rest }: Props) {
  return (
    <div
      style={{
        background: getColor(y),
        borderRadius: "50%",
        bottom: `${y * 100}%`,
        height: POINT_SIZE,
        left: `${x * 100}%`,
        position: "absolute",
        width: POINT_SIZE,
      }}
      {...rest}
    />
  );
}
