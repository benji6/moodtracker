import EventLog from "../../shared/EventLog";
import PushUpsCard from "../../shared/PushUpsCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function PushUpsLog() {
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const denormalizedPushUps = useSelector(
    eventsSlice.selectors.denormalizedPushUps,
  );

  return (
    <EventLog
      CardComponent={PushUpsCard}
      denormalizedEvents={denormalizedPushUps}
      eventType="push-ups"
      eventTypeLabel="push-ups"
      eventTypeLabelPlural="push-ups"
      normalizedEvents={normalizedPushUps}
    />
  );
}
