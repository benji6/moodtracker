import { Card, SubHeading } from "eri";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TEST_IDS } from "../../../constants";
import { timeFormatter } from "../../../dateTimeFormatters";
import { normalizedMoodsSelector } from "../../../selectors";
import { moodToColor } from "../../../utils";
import "./style.css";

interface Props {
  id: string;
}

export default function MoodCard({ id }: Props) {
  const navigate = useNavigate();
  const date = new Date(id);
  const normalizedMoods = useSelector(normalizedMoodsSelector);
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
              <SubHeading style={{ margin: "var(--space-0) 0" }}>
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
                <small
                  data-test-id={TEST_IDS.moodCardTime}
                  data-time={Math.round(date.getTime() / 1e3)}
                >
                  Lat: {location.latitude}
                  <br />
                  Long: {location.longitude}
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
      </div>
    </Card>
  );
}
