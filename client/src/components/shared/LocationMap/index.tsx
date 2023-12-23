/* eslint-disable @typescript-eslint/no-explicit-any */
import { LOCATION_MAP_HEIGHT, LOCATION_MAP_WIDTH } from "./constants";
import Marker from "./Marker";
import { ReactNode } from "react";
import { feature } from "topojson-client";
import { path } from "./utils";
import worldTopoJson from "./world-topojson.json";

const features: any[] = (
  feature(
    worldTopoJson as any,
    worldTopoJson.objects.ne_110m_admin_0_countries as any,
  ) as any
).features;

interface Props {
  children: ReactNode;
}

export default function LocationMap({ children }: Props) {
  return (
    <svg
      style={{ marginBlock: "-11%" }}
      viewBox={`0 0 ${LOCATION_MAP_WIDTH} ${LOCATION_MAP_HEIGHT}`}
    >
      <g>
        {features.map((d, i) => (
          <path
            d={path(d) ?? undefined}
            fill="var(--color-balance-less)"
            key={`geo-${i}`}
            stroke="var(--color-balance-more)"
          />
        ))}
      </g>
      {children}
    </svg>
  );
}

LocationMap.Marker = Marker;
