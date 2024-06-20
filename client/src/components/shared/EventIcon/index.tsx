import "./style.css";
import { EventTypeCategories } from "../../../types";
import { Icon } from "eri";

const EVENT_TYPE_TO_ICON = {
  "leg-raises": "🦵",
  "push-ups": "💪",
  runs: "🏃",
  "sit-ups": "🏋️",
  meditations: <Icon name="bell" />,
  moods: <Icon name="heart" />,
  sleeps: <Icon name="moon" />,
  weights: <Icon name="weight" />,
};

interface Props {
  eventType: EventTypeCategories;
  margin?: "end";
}

export default function EventIcon({ eventType, margin }: Props) {
  return margin ? (
    <span className="m-event-icon--margin-end">
      {EVENT_TYPE_TO_ICON[eventType]}
    </span>
  ) : (
    EVENT_TYPE_TO_ICON[eventType]
  );
}
