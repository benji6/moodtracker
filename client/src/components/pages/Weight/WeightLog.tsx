import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function WeightLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedWeights,
      )}
      eventType="weights"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedWeights)}
    />
  );
}
