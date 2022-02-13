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

  const locationsToRender: [string, DeviceGeolocation][] = [];
  for (const id of eventIdsInPeriod) {
    const event = events.byId[id];
    if (
      typeof event.payload === "string" ||
      !("location" in event.payload) ||
      !event.payload.location
    )
      continue;
    const { location } = event.payload;
    if (locationsToRender.length) {
      const lastLocation = locationsToRender[locationsToRender.length - 1][1];
      if (
        location.latitude === lastLocation.latitude &&
        location.longitude === lastLocation.longitude
      )
        continue;
    }
    locationsToRender.push([id, location]);
  }

  if (!locationsToRender.length) return null;

  return (
    <Paper>
      <h3>
        Location
        <SubHeading>Location of all moods and meditations</SubHeading>
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
