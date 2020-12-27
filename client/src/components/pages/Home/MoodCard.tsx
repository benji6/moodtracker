import { useNavigate } from "@reach/router";
import { Card, SubHeading } from "eri";
import * as React from "react";
import { timeFormatter } from "../../../formatters";
import { ServerMood } from "../../../types";
import { moodToColor } from "../../../utils";

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
      <h3 className="center" style={{ lineHeight: 1, marginBottom: ".1em" }}>
        {mood}
        {description && (
          <SubHeading style={{ margin: "var(--e-space-0) 0" }}>
            {description}
          </SubHeading>
        )}
      </h3>
      <p className="center" style={{ lineHeight: 1, marginBottom: 0 }}>
        <small>{timeFormatter.format(new Date(id))}</small>
      </p>
      {exploration && (
        <p style={{ lineHeight: 1, marginTop: "var(--e-space-0)" }}>
          <small>{exploration}</small>
        </p>
      )}
    </Card>
  );
}
