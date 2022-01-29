import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import LocationMarker from "./LocationMarker";
import worldTopoJson from "./world-topojson.json";

interface Props {
  children: React.ReactNode;
}

export default function LocationMap({ children }: Props) {
  return (
    <ComposableMap
      projectionConfig={{ scale: 147 }}
      style={{ marginBlock: "-11%" }}
    >
      <Geographies geography={worldTopoJson}>
        {({ geographies }) =>
          geographies.map((geo) => (
            <Geography
              fill="var(--color-balance-less)"
              geography={geo}
              key={geo.rsmKey}
              stroke="var(--color-balance-more)"
              style={{
                default: { outline: 0 },
                hover: { outline: 0 },
                pressed: { outline: 0 },
              }}
              tabIndex={undefined}
            />
          ))
        }
      </Geographies>
      {children}
    </ComposableMap>
  );
}

LocationMap.Marker = LocationMarker;
