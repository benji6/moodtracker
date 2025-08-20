import "./style.css";
import EventCard from "../EventCard";
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
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const { description, experiencedAt, exploration, mood } =
    normalizedMoods.byId[id];
  const date = new Date(experiencedAt ?? id);

  return (
    <EventCard
      color={moodToColor(mood)}
      eventType="moods"
      hideDateTimeCreated
      id={id}
    >
      <div>
        <h3 className="m-mood-card__heading">
          <span data-test-id={TEST_IDS.moodCardMood}>{mood}</span>
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
        </p>
      </div>
      {exploration && (
        <p className="m-mood-card__exploration pre-line">
          <small>{exploration}</small>
        </p>
      )}
    </EventCard>
  );
}
