import {
  LOCATION_MAP_HEIGHT,
  LOCATION_MAP_SCALE,
  LOCATION_MAP_WIDTH,
} from "./constants";
import { geoEqualEarth, geoPath } from "d3-geo";

export const projection = geoEqualEarth()
  .translate([LOCATION_MAP_WIDTH / 2, LOCATION_MAP_HEIGHT / 2])
  .scale(LOCATION_MAP_SCALE);

export const path = geoPath().projection(projection);
