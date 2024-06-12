import EventLog from "../../shared/EventLog";
import LegRaisesCard from "../../shared/LegRaisesCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function LegRaisesLog() {
  return (
    <EventLog
      CardComponent={LegRaisesCard}
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedLegRaises,
      )}
      eventType="leg-raises"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedLegRaises)}
    />
  );
}
