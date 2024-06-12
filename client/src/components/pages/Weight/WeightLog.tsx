import EventLog from "../../shared/EventLog";
import WeightCard from "../../shared/WeightCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function WeightLog() {
  return (
    <EventLog
      CardComponent={WeightCard}
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedWeights,
      )}
      eventType="weights"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedWeights)}
    />
  );
}
