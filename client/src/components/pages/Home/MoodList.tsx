import { NavigateFn } from "@reach/router";
import { Button, Card, Paper } from "eri";
import * as React from "react";
import { DispatchContext } from "../../AppState";
import CardGroup from "eri/dist/components/Card/CardGroup";
import { NormalizedMoods } from "../../../types";

interface Props {
  moods: NormalizedMoods;
  navigate: NavigateFn;
}

export default function MoodList({ moods, navigate }: Props) {
  const dispatch = React.useContext(DispatchContext);

  return (
    <Paper>
      <h2>Mood list</h2>
      {moods.allIds.length ? (
        <CardGroup>
          {[...moods.allIds].reverse().map((id) => {
            const mood = moods.byId[id];
            return (
              <Card key={id}>
                <ul>
                  <li>Mood: {mood.mood}</li>
                  <li>Created: {new Date(id).toLocaleString()}</li>
                  {mood.updatedAt && (
                    <li>
                      Updated: {new Date(mood.updatedAt).toLocaleString()}
                    </li>
                  )}
                </ul>
                <Button.Group>
                  <Button
                    onClick={() => navigate(`edit/${id}`)}
                    variant="secondary"
                  >
                    Edit
                  </Button>
                  <Button
                    danger
                    onClick={() =>
                      dispatch({
                        type: "events/add",
                        payload: {
                          type: "v1/moods/delete",
                          createdAt: new Date().toISOString(),
                          payload: id,
                        },
                      })
                    }
                    variant="secondary"
                  >
                    Delete
                  </Button>
                </Button.Group>
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
