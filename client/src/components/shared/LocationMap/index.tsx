/* eslint-disable @typescript-eslint/no-explicit-any */
import { feature } from "topojson-client";
import { LOCATION_MAP_HEIGHT, LOCATION_MAP_WIDTH } from "./constants";
import worldTopoJson from "./world-topojson.json";
import Marker from "./Marker";
import { path } from "./utils";

const features: any[] = (
  feature(
    worldTopoJson as any,
    worldTopoJson.objects.ne_110m_admin_0_countries as any,
  ) as any
).features;

interface Props {
  children: React.ReactNode;
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
