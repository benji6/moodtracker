import * as React from "react";
import Point from "./Point";
import { IPoint } from "./types";
import Line from "./Line";
import { CHART_ASPECT_RATIO } from "./constants";

interface Props {
  data: IPoint[];
  domain: [number, number];
  range: [number, number];
}

export default function Chart({ data, domain, range }: Props) {
  const points = data.map((datum) => ({
    ...datum,
    x: (datum.x - domain[0]) / (domain[1] - domain[0]),
    y: (datum.y - range[0]) / (range[1] - range[0]),
  }));

  return (
    <svg
      viewBox={`0 0 ${CHART_ASPECT_RATIO} 1`}
      style={{
        border: "var(--e-border-default)",
        filter: "var(--e-drop-shadow-0)",
      }}
      width="100%"
    >
      <Line points={points} />
      {points.map((point) => (
        <Point key={point.x} {...point} />
      ))}
    </svg>
  );
}
