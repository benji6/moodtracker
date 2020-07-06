import { interpolatePlasma } from "d3-scale-chromatic";
import * as React from "react";
import { POINT_SIZE } from "./constants";
import { ChartContext } from ".";

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
  const { domain, domainSpread, range, rangeSpread } = React.useContext(
    ChartContext
  );
  const normalizedY = (y - range[0]) / rangeSpread;
  return (
    <div
      style={{
        background: getColor(normalizedY),
        borderRadius: "50%",
        height: POINT_SIZE,
        position: "absolute",
        width: POINT_SIZE,
        left: `${((x - domain[0]) / domainSpread) * 100}%`,
        bottom: `${normalizedY * 100}%`,
      }}
      {...rest}
    />
  );
}
