import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventCard from "./EventCard";
import { EventTypeCategories } from "../../types";
import { TEST_IDS } from "../../constants";
import { dateTimeFormatter } from "../../formatters/dateTimeFormatters";

interface Props {
  eventType: EventTypeCategories;
  format?(n: number): string;
  id: string;
  value: number;
}

export default function ValueEventCard({
  eventType,
  format,
  id,
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
    </EventCard>
  );
}
