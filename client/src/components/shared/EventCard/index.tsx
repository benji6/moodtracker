import "./style.css";
import { DeviceGeolocation, EventTypeCategories } from "../../../types";
import { Card } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../constants/eventTypeToLabels";
import LocationString from "../LocationString";
import { TEST_IDS } from "../../../constants";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import { useNavigate } from "react-router-dom";

interface Props {
  eventType: EventTypeCategories;
  id: string;
  units?: string;
  location?: DeviceGeolocation;
  value: number;
}

export default function EventCard({
  eventType,
  id,
  location,
  units,
  value,
}: Props) {
  const navigate = useNavigate();
  const date = new Date(id);

  return (
    <Card onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div className="center">
          <b data-test-id={TEST_IDS.eventCardValue}>
            {value}
            {units
              ? units
              : ` ${
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
      </div>
    </Card>
  );
}
