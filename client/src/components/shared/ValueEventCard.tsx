import EVENT_TYPE_TO_LABELS from "../../constants/eventTypeToLabels";
import EventCard from "./EventCard";
import { EventTypeCategories } from "../../types";
import { TEST_IDS } from "../../constants";

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
  return (
    <EventCard eventType={eventType} id={id}>
      <b data-test-id={TEST_IDS.eventCardValue}>
        {format
          ? format(value)
          : `${value} ${
              EVENT_TYPE_TO_LABELS[eventType][
                value === 1 ? "singular" : "plural"
              ]
            }`}
      </b>
    </EventCard>
  );
}
