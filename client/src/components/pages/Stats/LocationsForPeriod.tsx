import { AppEventWithLocation, DeviceGeolocation } from "../../../types";
import { Paper, SubHeading } from "eri";
import LocationMap from "../../shared/LocationMap";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dateFrom: Date;
  dateTo: Date;
}

export default function LocationsForPeriod({ dateFrom, dateTo }: Props) {
  const eventsById = useSelector(eventsSlice.selectors.byId);
  const eventIdsWithLocationInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.idsWithLocationInPeriod(state, dateFrom, dateTo),
  );

  const coordinatesToRender = new Set();
  const locationsToRender: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsWithLocationInPeriod) {
    const { location } = (eventsById[id] as AppEventWithLocation).payload;
    const key = `${location.longitude},${location.latitude}`;
    if (coordinatesToRender.has(key)) continue;
    coordinatesToRender.add(key);
    locationsToRender.push([id, location]);
  }

  if (!locationsToRender.length) return;

  return (
    <Paper>
      <h3>
        Location
        <SubHeading>Location of all data you have tracked</SubHeading>
      </h3>
      <LocationMap>
        {locationsToRender.map(([id, location]) => (
          <LocationMap.Marker
            key={id}
            latitude={location.latitude}
            longitude={location.longitude}
          />
        ))}
      </LocationMap>
    </Paper>
  );
}
