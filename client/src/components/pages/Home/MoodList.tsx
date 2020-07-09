import { NavigateFn } from "@reach/router";
import { Card, Paper, SubHeading } from "eri";
import * as React from "react";
import CardGroup from "eri/dist/components/Card/CardGroup";
import { NormalizedMoods } from "../../../types";
import { moodToColor } from "../../../utils";

interface Props {
  moods: NormalizedMoods;
  navigate: NavigateFn;
}

export default function MoodList({ moods, navigate }: Props) {
  return (
    <Paper>
      <h2>Mood list</h2>
      {moods.allIds.length ? (
        <CardGroup>
          {[...moods.allIds].reverse().map((id) => {
            const mood = moods.byId[id];
            return (
              <Card
                key={id}
                onClick={() => navigate(`edit/${id}`)}
                style={
                  {
                    "--color": moodToColor(mood.mood / 10),
                  } as React.CSSProperties
                }
              >
                <h2 e-util="center">
                  {mood.mood}
                  <SubHeading>
                    {new Date(new Date(id).toLocaleString()).toLocaleString()}
                  </SubHeading>
                </h2>
              </Card>
            );
          })}
        </CardGroup>
      ) : (
        <p>No moods to display for this range</p>
      )}
    </Paper>
  );
}
