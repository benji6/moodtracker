import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function PushUpsLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedPushUps,
      )}
      eventType="push-ups"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedPushUps)}
    />
  );
}
