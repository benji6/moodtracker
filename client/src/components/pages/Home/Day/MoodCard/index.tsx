import { useNavigate } from "@reach/router";
import { Card, SubHeading } from "eri";
import * as React from "react";
import { timeFormatter } from "../../../../../formatters";
import { ServerMood } from "../../../../../types";
import { moodToColor } from "../../../../../utils";
import "./style.css";

export default function MoodCard({
  id,
  description,
  exploration,
  mood,
}: ServerMood) {
  const navigate = useNavigate();

  return (
    <Card
      color={moodToColor(mood)}
      key={id}
      onClick={() => navigate(`edit/${id}`)}
    >
      <div className="m-mood-card">
        <div>
          <h3 className="m-mood-card__heading center">
            {mood}
            {description && (
              <SubHeading style={{ margin: "var(--space-0) 0" }}>
                {description}
              </SubHeading>
            )}
          </h3>
          <p className="m-mood-card__time center">
            <small>{timeFormatter.format(new Date(id))}</small>
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
