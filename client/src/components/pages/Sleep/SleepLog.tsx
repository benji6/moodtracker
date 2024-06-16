import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SleepLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(eventsSlice.selectors.denormalizedSleeps)}
      eventType="sleeps"
      normalizedEvents={useSelector(
        eventsSlice.selectors.normalizedSleepsSortedByDateAwoke,
      )}
    />
  );
}
