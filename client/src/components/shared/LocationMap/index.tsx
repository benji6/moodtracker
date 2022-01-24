import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import worldTopoJson from "./world-topojson.json";

interface Props {
  latitude: number;
  longitude: number;
}

export default function LocationMap({ latitude, longitude }: Props) {
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
      <Marker coordinates={[longitude, latitude]}>
        <g
          fill="none"
          stroke="var(--color-highlight-default)"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          transform="translate(-12, -24)"
        >
          <circle cx="12" cy="10" r="3" />
          <path d="M12 21.7C17.3 17 20 13 20 10a8 8 0 1 0-16 0c0 3 2.7 6.9 8 11.7z" />
        </g>
      </Marker>
    </ComposableMap>
  );
}
