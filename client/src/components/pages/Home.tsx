import { RouteComponentProps, Link, NavigateFn } from "@reach/router";
import { Paper, Fab, Icon, Button } from "eri";
import * as React from "react";
import { DispatchContext, StateContext } from "../AppState";

export default function Home({ navigate }: RouteComponentProps) {
  const dispatch = React.useContext(DispatchContext);
  const state = React.useContext(StateContext);
  return (
    <Paper.Group>
      <Paper>
        <h2>Moods</h2>
        {state.moods.allIds.length ? (
          <ul>
            {state.moods.allIds.map((id) => {
              const mood = state.moods.byId[id];
              return (
                <li key={id}>
                  {new Date(id).toLocaleString()}: {mood.mood}{" "}
                  <Button
                    danger
                    onClick={() =>
                      dispatch({
                        type: "moods/delete",
                        payload: id,
                      })
                    }
                    variant="secondary"
                  >
                    Delete
                  </Button>
                </li>
              );
            })}
          </ul>
        ) : (
          <>
            <p>Welcome to MoodTracker!</p>
            <p>
              <Link to="add">Click here to add your first mood</Link>
            </p>
          </>
        )}
        <Fab
          aria-label="add new mood"
          onClick={() => (navigate as NavigateFn)("add")}
        >
          <Icon name="plus" size="4" />
        </Fab>
      </Paper>
    </Paper.Group>
  );
}
