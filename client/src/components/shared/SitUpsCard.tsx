import ValueEventCard from "./ValueEventCard";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function SitUpsCard({ id }: Props) {
  const normalizedSitUps = useSelector(eventsSlice.selectors.normalizedSitUps);
  const sitUps = normalizedSitUps.byId[id];

  return (
    <ValueEventCard
      eventType="sit-ups"
      id={id}
      location={sitUps.location}
      value={sitUps.value}
    />
  );
}
