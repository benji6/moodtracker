import EventLog from "../../shared/EventLog";
import SleepCard from "../../shared/SleepCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SleepLog() {
  const normalizedSleeps = useSelector(
    eventsSlice.selectors.normalizedSleepsSortedByDateAwoke,
  );
  const denormalizedSleeps = useSelector(
    eventsSlice.selectors.denormalizedSleeps,
  );

  return (
    <EventLog
      CardComponent={SleepCard}
      denormalizedEvents={denormalizedSleeps}
      eventType="sleeps"
      eventTypeLabel="sleep"
      eventTypeLabelPlural="sleeps"
      normalizedEvents={normalizedSleeps}
    />
  );
}
