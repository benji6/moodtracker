import ValueEventCard from "./ValueEventCard";
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

  return <ValueEventCard eventType="push-ups" id={id} value={pushUps.value} />;
}
