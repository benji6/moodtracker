import * as React from "react";
import * as regression from "regression";
import Point from "./Point";
import { TPoint } from "./types";
import Line from "./Line";
import { CHART_ASPECT_RATIO, LINE_WIDTH_1, POINT_RADIUS } from "./constants";
import { MOOD_RANGE } from "../../../../constants";

const Y_MARGIN = 0.1;
const X_AXIS_LABEL_MARGIN = Y_MARGIN * CHART_ASPECT_RATIO;
const AXIS_MARKER_LENGTH = 0.02;

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
      style={{ background: "var(--e-color-ground-more)" }}
      width="100%"
    >
      <svg
        y={Y_MARGIN / 2}
        height={1 - Y_MARGIN}
        viewBox={`0 0 ${CHART_ASPECT_RATIO} 1`}
        width={CHART_ASPECT_RATIO - X_AXIS_LABEL_MARGIN}
        x={X_AXIS_LABEL_MARGIN}
      >
        <Line
          color="var(--e-color-balance-less)"
          points={regressionResult.points}
          thickness={LINE_WIDTH_1}
        />
        <Line points={points} />
        {points.map((point) => (
          <Point key={point[0]} x={point[0]} y={point[1]} />
        ))}
      </svg>
      <line
        x1={X_AXIS_LABEL_MARGIN}
        x2={CHART_ASPECT_RATIO}
        y1={1 - Y_MARGIN / 2}
        y2={1 - Y_MARGIN / 2}
        stroke="currentColor"
        strokeWidth={LINE_WIDTH_1}
      />
      <line
        x1={X_AXIS_LABEL_MARGIN}
        x2={X_AXIS_LABEL_MARGIN}
        y1={Y_MARGIN / 2 + POINT_RADIUS}
        y2={1 - Y_MARGIN / 2}
        stroke="currentColor"
        strokeWidth={LINE_WIDTH_1}
      />
      {[...Array(MOOD_RANGE[1] + 1).keys()].map((n) => {
        const y =
          (1 - Y_MARGIN - POINT_RADIUS) * (1 - n / MOOD_RANGE[1]) +
          Y_MARGIN / 2 +
          POINT_RADIUS;

        return (
          <React.Fragment key={n}>
            <line
              stroke="currentColor"
              strokeWidth={LINE_WIDTH_1}
              x1={X_AXIS_LABEL_MARGIN - AXIS_MARKER_LENGTH}
              x2={X_AXIS_LABEL_MARGIN + LINE_WIDTH_1 / 2}
              y1={y}
              y2={y}
            />
            <text
              dominantBaseline="central"
              fill="currentColor"
              style={{ fontSize: 2 / 30 }}
              textAnchor="middle"
              x={(X_AXIS_LABEL_MARGIN - AXIS_MARKER_LENGTH) / 2}
              y={y}
            >
              {n}
            </text>
          </React.Fragment>
        );
      })}
    </svg>
  );
}
