import * as React from "react";
import { GRAPH_HEIGHT, POINT_SIZE } from "./constants";
import Point from "./Point";

export default function Chart(props: React.HtmlHTMLAttributes<HTMLDivElement>) {
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
        {...props}
      />
    </div>
  );
}

Chart.Point = Point;
