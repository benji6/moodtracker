import { Paper, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { eventsAllIdsSelector, eventsByIdSelector } from "../../../selectors";
import { DeviceGeolocation } from "../../../types";
import { getIdsInInterval } from "../../../utils";
import LocationMap from "../../shared/LocationMap";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function LocationsForPeriod({ fromDate, toDate }: Props) {
  const eventsAllIds = useSelector(eventsAllIdsSelector);
  const eventsById = useSelector(eventsByIdSelector);
  const eventIdsInPeriod = getIdsInInterval(eventsAllIds, fromDate, toDate);

  const coordinatesToRender = new Set();
  const locationsToRender: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsInPeriod) {
    const event = eventsById[id];
    if (
      typeof event.payload === "string" ||
      !("location" in event.payload) ||
      !event.payload.location
    )
      continue;
    const { location } = event.payload;
    const key = `${location.longitude},${location.latitude}`;
    if (coordinatesToRender.has(key)) continue;
    coordinatesToRender.add(key);
    locationsToRender.push([id, location]);
  }

  if (!locationsToRender.length) return null;

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
