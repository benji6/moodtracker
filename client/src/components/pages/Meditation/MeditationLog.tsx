import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function MeditationLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedMeditations,
      )}
      eventType="meditations"
      normalizedEvents={useSelector(
        eventsSlice.selectors.normalizedMeditations,
      )}
    />
  );
}
