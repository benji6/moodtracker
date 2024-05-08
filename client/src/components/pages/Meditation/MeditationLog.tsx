import EventLog from "../../shared/EventLog";
import MeditationCard from "../../shared/MeditationCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function MeditationLog() {
  const normalizedMeditations = useSelector(
    eventsSlice.selectors.normalizedMeditations,
  );
  const denormalizedMeditations = useSelector(
    eventsSlice.selectors.denormalizedMeditations,
  );

  return (
    <EventLog
      CardComponent={MeditationCard}
      denormalizedEvents={denormalizedMeditations}
      eventType="meditations"
      eventTypeLabel="meditation"
      eventTypeLabelPlural="meditations"
      normalizedEvents={normalizedMeditations}
    />
  );
}
