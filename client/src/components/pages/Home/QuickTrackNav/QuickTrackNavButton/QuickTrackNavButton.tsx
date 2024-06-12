import "./style.css";
import {
  EVENT_TYPE_TO_ICON,
  EVENT_TYPE_TO_LABEL,
} from "../../../../../constants/eventTypeMappings";
import { Button } from "eri";
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
        {EVENT_TYPE_TO_ICON[eventType]}
      </span>
      Add {EVENT_TYPE_TO_LABEL[eventType]}
    </Button>
  );
}
