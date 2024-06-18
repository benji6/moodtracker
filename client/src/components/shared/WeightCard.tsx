import ValueEventCard from "./ValueEventCard";
import eventsSlice from "../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function WeightCard({ id }: Props) {
  const weights = useSelector(eventsSlice.selectors.normalizedWeights);
  const weight = weights.byId[id];

  return (
    <ValueEventCard
      eventType="weights"
      id={id}
      location={weight.location}
      units="kg"
      value={weight.value}
    />
  );
}
