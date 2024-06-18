import { DeviceGeolocation, EventTypeCategories } from "../../types";
import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventCard from "./EventCard";
import LocationString from "./LocationString";
import { TEST_IDS } from "../../constants";
import { dateTimeFormatter } from "../../formatters/dateTimeFormatters";

interface Props {
  eventType: EventTypeCategories;
  format?(n: number): string;
  id: string;
  location?: DeviceGeolocation;
  value: number;
}

export default function ValueEventCard({
  eventType,
  format,
  id,
  location,
  value,
}: Props) {
  const date = new Date(id);

  return (
    <EventCard eventType={eventType} id={id}>
      <div>
        <b data-test-id={TEST_IDS.eventCardValue}>
          {format
            ? format(value)
            : `${value} ${
                EVENT_TYPE_TO_LABELS[eventType][
                  value === 1 ? "singular" : "plural"
                ]
              }`}
        </b>
      </div>
      <div>
        <small
          data-test-id={TEST_IDS.eventCardTime}
          data-time={Math.round(date.getTime() / 1e3)}
        >
          {dateTimeFormatter.format(date)}
        </small>
      </div>
      <div>
        {location && (
          <small>
            <LocationString
              errorFallback={
                <>
                  Lat: {location.latitude}
                  <br />
                  Lon: {location.longitude}
                </>
              }
              latitude={location.latitude}
              longitude={location.longitude}
            />
          </small>
        )}
      </div>
    </EventCard>
  );
}
