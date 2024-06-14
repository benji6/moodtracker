import "./style.css";
import { Button } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../../../constants/eventTypeToLabels";
import { EventTypeCategories } from "../../../../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  eventType: EventTypeCategories;
}

export function QuickTrackNavButton({ eventType }: Props) {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`/${eventType}/add`)}>
      <span className="m-quick-track-nav-button__icon">
        {EVENT_TYPE_TO_LABELS[eventType].icon}
      </span>
      Add {EVENT_TYPE_TO_LABELS[eventType].default}
    </Button>
  );
}
