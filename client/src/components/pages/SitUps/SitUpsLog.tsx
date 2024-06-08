import EventLog from "../../shared/EventLog";
import SitUpsCard from "../../shared/SitUpsCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function SitUpsLog() {
  const normalizedSitUps = useSelector(eventsSlice.selectors.normalizedSitUps);
  const denormalizedSitUps = useSelector(
    eventsSlice.selectors.denormalizedSitUps,
  );

  return (
    <EventLog
      CardComponent={SitUpsCard}
      denormalizedEvents={denormalizedSitUps}
      eventType="sit-ups"
      eventTypeLabel="sit-ups"
      eventTypeLabelPlural="sit-ups"
      normalizedEvents={normalizedSitUps}
    />
  );
}
