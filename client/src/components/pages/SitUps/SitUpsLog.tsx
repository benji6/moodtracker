import EventLog from "../../shared/EventLog";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SitUpsLog() {
  return (
    <EventLog
      denormalizedEvents={useSelector(eventsSlice.selectors.denormalizedSitUps)}
      eventType="sit-ups"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedSitUps)}
    />
  );
}
