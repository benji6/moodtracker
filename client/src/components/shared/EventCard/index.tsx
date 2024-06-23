import "./style.css";
import { Card } from "eri";
import EventCardLocationAndWeather from "./EventCardLocationAndWeather";
import EventIcon from "../EventIcon";
import { EventTypeCategories } from "../../../types";
import { ReactNode } from "react";
import { TEST_IDS } from "../../../constants";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
  color?: string;
  eventType: EventTypeCategories;
  hideDateTime?: boolean;
  id: string;
}

export default function EventCard({
  children,
  color,
  eventType,
  hideDateTime = false,
  id,
}: Props) {
  const navigate = useNavigate();
  const date = new Date(id);
  const event = useSelector(
    eventsSlice.selectors.allNormalizedTrackedCategories,
  ).byId[id];

  return (
    <Card color={color} onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div className="m-event-card__icon">
          <EventIcon eventType={eventType} />
        </div>
        {children}
        {!hideDateTime && (
          <div>
            <small
              data-test-id={TEST_IDS.eventCardDateTime}
              data-time={Math.round(date.getTime() / 1e3)}
            >
              {dateTimeFormatter.format(date)}
            </small>
          </div>
        )}
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
