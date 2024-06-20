import { Button } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../../constants/eventTypeToLabels";
import EventIcon from "../../../shared/EventIcon";
import { EventTypeCategories } from "../../../../types";
import { useNavigate } from "react-router-dom";

interface Props {
  eventType: EventTypeCategories;
}

export function QuickTrackNavButton({ eventType }: Props) {
  const navigate = useNavigate();
  return (
    <Button onClick={() => navigate(`/${eventType}/add`)}>
      <EventIcon eventType={eventType} margin="end" />
      Add {EVENT_TYPE_TO_LABELS[eventType].default}
    </Button>
  );
}
