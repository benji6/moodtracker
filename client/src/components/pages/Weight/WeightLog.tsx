import EventLog from "../../shared/EventLog";
import WeightCard from "../../shared/WeightCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function WeightLog() {
  const normalizedWeights = useSelector(
    eventsSlice.selectors.normalizedWeights,
  );
  const denormalizedWeights = useSelector(
    eventsSlice.selectors.denormalizedWeights,
  );

  return (
    <EventLog
      CardComponent={WeightCard}
      denormalizedEvents={denormalizedWeights}
      eventType="weights"
      eventTypeLabel="weight"
      eventTypeLabelPlural="weights"
      normalizedEvents={normalizedWeights}
    />
  );
}
