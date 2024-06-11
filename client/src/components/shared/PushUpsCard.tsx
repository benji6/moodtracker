import EventCard from "./EventCard";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function PushUpsCard({ id }: Props) {
  const normalizedPushUps = useSelector(
    eventsSlice.selectors.normalizedPushUps,
  );
  const pushUps = normalizedPushUps.byId[id];

  return (
    <EventCard
      eventType="push-ups"
      id={id}
      location={pushUps.location}
      value={pushUps.value}
    />
  );
}
