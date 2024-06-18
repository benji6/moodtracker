import "./style.css";
import { Card } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../constants/eventTypeToLabels";
import { EventTypeCategories } from "../../../types";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";

interface Props {
  children: ReactNode;
  color?: string;
  eventType: EventTypeCategories;
  id: string;
}

export default function EventCard({ children, color, eventType, id }: Props) {
  const navigate = useNavigate();

  return (
    <Card color={color} onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div style={{ color }}>{EVENT_TYPE_TO_LABELS[eventType].icon}</div>
        {children}
      </div>
    </Card>
  );
}
