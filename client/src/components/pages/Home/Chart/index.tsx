import * as React from "react";
import { GRAPH_HEIGHT, POINT_SIZE } from "./constants";
import Point from "./Point";

interface Point {
  x: number;
  y: number;
  title: string;
}

interface Props {
  data: Point[];
  domain: [number, number];
  range: [number, number];
}

export default function Chart({ data, domain, range }: Props) {
  return (
    <div
      style={{
        border: "var(--e-border-default)",
        filter: "var(--e-drop-shadow-0)",
        height: GRAPH_HEIGHT,
      }}
    >
      <div
        style={{
          height: `calc(100% - ${POINT_SIZE}px)`,
          marginRight: POINT_SIZE,
          marginTop: POINT_SIZE,
          position: "relative",
        }}
      >
        {data.map((datum) => (
          <Point
            {...datum}
            x={(datum.x - domain[0]) / (domain[1] - domain[0])}
            y={(datum.y - range[0]) / (range[1] - range[0])}
          />
        ))}
      </div>
    </div>
  );
}
