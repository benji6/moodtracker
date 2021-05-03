import { useNavigate } from "@reach/router";
import { Card, SubHeading } from "eri";
import * as React from "react";
import { TEST_IDS } from "../../../constants";
import { timeFormatter } from "../../../formatters";
import { ServerMood } from "../../../types";
import { moodToColor } from "../../../utils";
import "./style.css";

export default function MoodCard({
  id,
  description,
  exploration,
  mood,
}: ServerMood) {
  const navigate = useNavigate();
  const date = new Date(id);

  return (
    <Card
      color={moodToColor(mood)}
      key={id}
      onClick={() => navigate(`edit/${id}`)}
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
