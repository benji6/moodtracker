import * as React from "react";
import * as regression from "regression";
import Point from "./Point";
import { TPoint } from "./types";
import Line from "./Line";
import { CHART_ASPECT_RATIO } from "./constants";

interface Props {
  data: TPoint[];
  domain: [number, number];
  range: [number, number];
}

export default function Chart({ data, domain, range }: Props) {
  const points = data.map(([x, y]): [number, number] => [
    (x - domain[0]) / (domain[1] - domain[0]),
    (y - range[0]) / (range[1] - range[0]),
  ]);

  const regressionResult = regression.polynomial(points, {
    order: 6,
    precision: 3,
  });

  return (
    <svg
      viewBox={`0 0 ${CHART_ASPECT_RATIO} 1`}
      style={{ border: "var(--e-border-default)" }}
      width="100%"
    >
      <Line
        color="var(--e-color-balance-less)"
        points={regressionResult.points}
        thicknessMultiplier={3}
      />
      <Line points={points} />
      {points.map((point) => (
        <Point key={point[0]} x={point[0]} y={point[1]} />
      ))}
    </svg>
  );
}
