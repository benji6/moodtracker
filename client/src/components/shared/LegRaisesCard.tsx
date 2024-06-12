import EventCard from "./EventCard";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function LegRaisesCard({ id }: Props) {
  const normalizedEvents = useSelector(
    eventsSlice.selectors.normalizedLegRaises,
  );
  const event = normalizedEvents.byId[id];

  return (
    <EventCard
      eventType="leg-raises"
      id={id}
      location={event.location}
      value={event.value}
    />
  );
}
