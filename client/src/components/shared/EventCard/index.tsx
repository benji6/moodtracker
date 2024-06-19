import "./style.css";
import { Card } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../constants/eventTypeToLabels";
import { EventTypeCategories } from "../../../types";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  eventType: EventTypeCategories;
  id: string;
}

export default function EventCard({ children, eventType, id }: Props) {
  const navigate = useNavigate();

  return (
    <Card onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div className="m-event-card__icon">
          {EVENT_TYPE_TO_LABELS[eventType].icon}
        </div>
        {children}
      </div>
    </Card>
  );
}
