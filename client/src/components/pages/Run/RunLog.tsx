import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function RunLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(eventsSlice.selectors.denormalizedRuns)}
      eventType="runs"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedRuns)}
    />
  );
}
