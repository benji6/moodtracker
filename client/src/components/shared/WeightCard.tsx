import ValueEventCard from "./ValueEventCard";
import eventsSlice from "../../store/eventsSlice";
import { kilogramFormatter } from "../../formatters/numberFormatters";
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
      format={(n) => kilogramFormatter.format(n)}
      id={id}
      location={weight.location}
      value={weight.value}
    />
  );
}
