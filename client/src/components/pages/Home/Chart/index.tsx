import * as React from "react";
import { GRAPH_HEIGHT, POINT_SIZE } from "./constants";
import Point from "./Point";

interface Props {
  domain: [number, number];
  range: [number, number];
  children: React.ReactNode;
}

interface Context {
  domain: Props["domain"];
  domainSpread: number;
  range: Props["range"];
  rangeSpread: number;
}

export const ChartContext = React.createContext<Context>({
  domain: [0, 0],
  domainSpread: 0,
  range: [0, 0],
  rangeSpread: 0,
});

export default function Chart({ domain, range, children }: Props) {
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
        <ChartContext.Provider
          value={{
            domain,
            domainSpread: domain[1] - domain[0],
            range,
            rangeSpread: range[1] - range[0],
          }}
        >
          {children}
        </ChartContext.Provider>
      </div>
    </div>
  );
}

Chart.Point = Point;
