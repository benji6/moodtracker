import "./style.css";
import EventCard from "../EventCard";
import LocationString from "../LocationString";
import MoodCardWeather from "./MoodCardWeather";
import { SubHeading } from "eri";
import { TEST_IDS } from "../../../constants";
import eventsSlice from "../../../store/eventsSlice";
import { moodToColor } from "../../../utils";
import { timeFormatter } from "../../../formatters/dateTimeFormatters";
import { useSelector } from "react-redux";

interface Props {
  id: string;
}

export default function MoodCard({ id }: Props) {
  const date = new Date(id);
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const { description, exploration, location, mood } = normalizedMoods.byId[id];

  return (
    <EventCard color={moodToColor(mood)} eventType="moods" id={id}>
      <div>
        <h3 className="m-mood-card__heading">
          <span data-test-id={TEST_IDS.moodCardMood}>
            {mood}
            {/* {EVENT_TYPE_TO_LABELS.moods.icon} */}
          </span>
          {description && (
            <SubHeading
              data-test-id={TEST_IDS.moodCardTags}
              style={{ margin: "var(--space-0) 0" }}
            >
              {description}
            </SubHeading>
          )}
        </h3>
        <p className="m-mood-card__time center">
          <small
            data-test-id={TEST_IDS.moodCardTime}
            data-time={Math.round(date.getTime() / 1e3)}
          >
            {timeFormatter.format(date)}
          </small>
          {location && (
            <>
              <br />
              <small>
                <LocationString
                  latitude={location.latitude}
                  longitude={location.longitude}
                />
              </small>
            </>
          )}
        </p>
      </div>
      {exploration && (
        <p className="m-mood-card__exploration pre-line">
          <small>{exploration}</small>
        </p>
      )}
      {location && (
        <MoodCardWeather
          date={date}
          latitude={location.latitude}
          longitude={location.longitude}
        />
      )}
    </EventCard>
  );
}
