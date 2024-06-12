import EventLog from "../../shared/EventLog";
import SitUpsCard from "../../shared/SitUpsCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SitUpsLog() {
  return (
    <EventLog
      CardComponent={SitUpsCard}
      denormalizedEvents={useSelector(eventsSlice.selectors.denormalizedSitUps)}
      eventType="sit-ups"
      normalizedEvents={useSelector(eventsSlice.selectors.normalizedSitUps)}
    />
  );
}
