import "./style.css";
import { Card } from "eri";
import EVENT_TYPE_TO_LABELS from "../../../constants/eventTypeToLabels";
import EventCardLocationAndWeather from "./EventCardLocationAndWeather";
import { EventTypeCategories } from "../../../types";
import { ReactNode } from "react";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
  color?: string;
  eventType: EventTypeCategories;
  id: string;
}

export default function EventCard({ children, color, eventType, id }: Props) {
  const navigate = useNavigate();
  const event = useSelector(
    eventsSlice.selectors.allNormalizedTrackedCategories,
  ).byId[id];

  return (
    <Card color={color} onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div className="m-event-card__icon">
          {EVENT_TYPE_TO_LABELS[eventType].icon}
        </div>
        {children}
        {"location" in event && event.location && (
          <EventCardLocationAndWeather
            date={new Date(id)}
            latitude={event.location.latitude}
            longitude={event.location.longitude}
          />
        )}
      </div>
    </Card>
  );
}
