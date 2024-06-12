import EventLog from "../../shared/EventLog";
import MeditationCard from "../../shared/MeditationCard";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

export default function MeditationLog() {
  return (
    <EventLog
      CardComponent={MeditationCard}
      denormalizedEvents={useSelector(
        eventsSlice.selectors.denormalizedMeditations,
      )}
      eventType="meditations"
      normalizedEvents={useSelector(
        eventsSlice.selectors.normalizedMeditations,
      )}
    />
  );
}
