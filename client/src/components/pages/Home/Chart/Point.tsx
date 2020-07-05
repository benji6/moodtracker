import * as React from "react";
import { POINT_SIZE } from "./constants";
import { ChartContext } from ".";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  x: number;
  y: number;
}

export default function Point({ x, y, ...rest }: Props) {
  const { domain, domainSpread, range, rangeSpread } = React.useContext(
    ChartContext
  );
  return (
    <div
      style={{
        background: "var(--e-color-theme)",
        borderRadius: "50%",
        height: POINT_SIZE,
        position: "absolute",
        width: POINT_SIZE,
        left: `${((x - domain[0]) / domainSpread) * 100}%`,
        bottom: `${((y - range[0]) / rangeSpread) * 100}%`,
      }}
      {...rest}
    />
  );
}
