import "./style.css";
import { Card } from "eri";
import EventCardLocationAndWeather from "./EventCardLocationAndWeather";
import EventIcon from "../EventIcon";
import { EventTypeCategories } from "../../../types";
import { ReactNode } from "react";
import { TEST_IDS } from "../../../constants";
import { dateTimeFormatter } from "../../../formatters/dateTimeFormatters";
import eventsSlice from "../../../store/eventsSlice";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";

interface Props {
  children: ReactNode;
  color?: string;
  eventType: EventTypeCategories;
  hideDateTimeCreated?: boolean;
  id: string;
}

export default function EventCard({
  children,
  color,
  eventType,
  hideDateTimeCreated = false,
  id,
}: Props) {
  const navigate = useNavigate();
  const dateCreated = new Date(id);
  const event = useSelector(
    eventsSlice.selectors.allNormalizedTrackedCategories,
  ).byId[id];

  const dateExperiencedAt = new Date(
    ("experiencedAt" in event && event.experiencedAt) ||
      ("dateAwoke" in event && event.dateAwoke) ||
      id,
  );

  return (
    <Card color={color} onClick={() => navigate(`/${eventType}/edit/${id}`)}>
      <div className="m-event-card">
        <div className="m-event-card__icon">
          <EventIcon eventType={eventType} />
        </div>
        {children}
        {!hideDateTimeCreated && (
          <div>
            <small
              data-test-id={TEST_IDS.eventCardDateTime}
              data-time={Math.round(dateCreated.getTime() / 1e3)}
            >
              {dateTimeFormatter.format(dateCreated)}
            </small>
          </div>
        )}
        {"location" in event && event.location && (
          <EventCardLocationAndWeather
            date={dateExperiencedAt}
            latitude={event.location.latitude}
            longitude={event.location.longitude}
          />
        )}
      </div>
    </Card>
  );
}
