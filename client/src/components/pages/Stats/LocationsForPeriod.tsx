import { Paper, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { eventsSelector } from "../../../selectors";
import { DeviceGeolocation } from "../../../types";
import { getIdsInInterval } from "../../../utils";
import LocationMap from "../../shared/LocationMap";

interface Props {
  fromDate: Date;
  toDate: Date;
}

export default function LocationsForPeriod({ fromDate, toDate }: Props) {
  const events = useSelector(eventsSelector);
  const eventIdsInPeriod = getIdsInInterval(events.allIds, fromDate, toDate);

  const locations: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsInPeriod) {
    const event = events.byId[id];
    if (
      typeof event.payload === "string" ||
      !("location" in event.payload) ||
      !event.payload.location
    )
      continue;
    locations.push([id, event.payload.location]);
  }

  if (!locations.length) return null;

  return (
    <Paper>
      <h3>
        Location
        <SubHeading>Location of all moods and meditations</SubHeading>
      </h3>
      <LocationMap>
        {locations.map(([id, location]) => (
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
