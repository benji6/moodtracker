import * as React from "react";
import * as regression from "regression";
import Point from "./Point";
import { TPoint } from "./types";
import Line from "./Line";
import {
  CHART_ASPECT_RATIO,
  LINE_WIDTH_2,
  POINT_RADIUS,
  LINE_WIDTH_0,
} from "./constants";

const MARGIN_BOTTOM = 0.125;
const MARGIN_LEFT = 0.125;
const MARGIN_RIGHT = 0.1;
const MARGIN_TOP = 0.05;
const AXIS_MARKER_LENGTH = 0.02;

type TLabel = [number, string]; // [x/y position, label text]

interface Props {
  data: TPoint[];
  domain: [number, number];
  range: [number, number];
  xLabels: TLabel[];
  yLabels: TLabel[];
}

export default function Chart({
  data,
  domain,
  range,
  xLabels,
  yLabels,
}: Props) {
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
      {xLabels.map(([labelX, labelText]) => {
        const x =
          ((labelX - domain[0]) / (domain[1] - domain[0])) *
            CHART_ASPECT_RATIO *
            (1 - (MARGIN_LEFT + MARGIN_RIGHT) / CHART_ASPECT_RATIO) +
          MARGIN_LEFT;

        return (
          <React.Fragment key={labelX}>
            {/* x-grid-line */}
            <line
              stroke="var(--e-color-balance)"
              strokeDasharray={LINE_WIDTH_2}
              strokeWidth={LINE_WIDTH_0}
              x1={x}
              x2={x}
              y1={MARGIN_TOP}
              y2={1 - MARGIN_BOTTOM}
            />

            {/* x-axis-marker */}
            <line
              stroke="currentColor"
              strokeWidth={LINE_WIDTH_2}
              x1={x}
              x2={x}
              y1={1 - MARGIN_BOTTOM - LINE_WIDTH_2 / 2}
              y2={1 - MARGIN_BOTTOM + AXIS_MARKER_LENGTH}
            />

            {/* x-label */}
            <text
              dominantBaseline="central"
              fill="currentColor"
              style={{ fontSize: 0.06 }}
              textAnchor="middle"
              x={x}
              y={1 - (MARGIN_BOTTOM - AXIS_MARKER_LENGTH) / 2}
            >
              {labelText}
            </text>
          </React.Fragment>
        );
      })}
      {yLabels.map(([labelY, labelText]) => {
        const y =
          (1 - MARGIN_BOTTOM - MARGIN_TOP - POINT_RADIUS) *
            (1 - (labelY - range[0]) / (range[1] - range[0])) +
          MARGIN_TOP +
          POINT_RADIUS;

        return (
          <React.Fragment key={labelY}>
            {/* y-grid-line */}
            <line
              stroke="var(--e-color-balance)"
              strokeDasharray={LINE_WIDTH_2}
              strokeWidth={LINE_WIDTH_0}
              x1={MARGIN_LEFT}
              x2={CHART_ASPECT_RATIO - MARGIN_RIGHT}
              y1={y}
              y2={y}
            />

            {/* y-axis-marker */}
            <line
              stroke="currentColor"
              strokeWidth={LINE_WIDTH_2}
              x1={MARGIN_LEFT - AXIS_MARKER_LENGTH}
              x2={MARGIN_LEFT + LINE_WIDTH_2 / 2}
              y1={y}
              y2={y}
            />

            {/* y-label */}
            <text
              dominantBaseline="central"
              fill="currentColor"
              style={{ fontSize: 0.06 }}
              textAnchor="middle"
              x={(MARGIN_LEFT - AXIS_MARKER_LENGTH) / 2}
              y={y}
            >
              {labelText}
            </text>
          </React.Fragment>
        );
      })}

      <svg
        height={1 - MARGIN_BOTTOM - MARGIN_TOP}
        viewBox={`0 0 ${CHART_ASPECT_RATIO} 1`}
        width={CHART_ASPECT_RATIO - MARGIN_LEFT - MARGIN_RIGHT}
        x={MARGIN_LEFT}
        y={MARGIN_TOP}
        preserveAspectRatio="none"
      >
        {/* chart regression line */}
        <Line
          color="var(--e-color-balance-less)"
          points={regressionResult.points}
          thickness={LINE_WIDTH_2}
        />

        {/* chart line */}
        <Line points={points} />

        {/* chart points */}
        {points.map((point) => (
          <Point key={point[0]} x={point[0]} y={point[1]} />
        ))}
      </svg>

      {/* x-axis */}
      <line
        x1={MARGIN_LEFT}
        x2={CHART_ASPECT_RATIO - MARGIN_RIGHT}
        y1={1 - MARGIN_BOTTOM}
        y2={1 - MARGIN_BOTTOM}
        stroke="currentColor"
        strokeWidth={LINE_WIDTH_2}
      />

      {/* y-axis */}
      <line
        x1={MARGIN_LEFT}
        x2={MARGIN_LEFT}
        y1={MARGIN_TOP + POINT_RADIUS}
        y2={1 - MARGIN_BOTTOM}
        stroke="currentColor"
        strokeWidth={LINE_WIDTH_2}
      />
    </svg>
  );
}
