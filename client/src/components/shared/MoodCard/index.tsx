import { Card, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TEST_IDS } from "../../../constants";
import { timeFormatter } from "../../../formatters/dateTimeFormatters";
import { moodToColor } from "../../../utils";
import LocationString from "../LocationString";
import MoodCardWeather from "./MoodCardWeather";
import "./style.css";
import eventsSlice from "../../../store/eventsSlice";

interface Props {
  id: string;
}

export default function MoodCard({ id }: Props) {
  const navigate = useNavigate();
  const date = new Date(id);
  const normalizedMoods = useSelector(eventsSlice.selectors.normalizedMoods);
  const { description, exploration, location, mood } = normalizedMoods.byId[id];

  return (
    <Card
      color={moodToColor(mood)}
      key={id}
      onClick={() => navigate(`/edit/${id}`)}
    >
      <div className="m-mood-card">
        <div>
          <h3 className="m-mood-card__heading center">
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
      </div>
    </Card>
  );
}
