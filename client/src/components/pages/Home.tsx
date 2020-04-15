import { RouteComponentProps, Link, NavigateFn } from "@reach/router";
import { Paper, Fab, Icon } from "eri";
import * as React from "react";
import { StateContext } from "../AppState";

export default function Home({ navigate }: RouteComponentProps) {
  const state = React.useContext(StateContext);
  return (
    <Paper.Group>
      <Paper>
        <h2>Moods</h2>
        {state.moods.length ? (
          <ul>
            {state.moods.map((mood) => (
              <li key={mood.createdAt}>
                {new Date(mood.createdAt).toLocaleString()}: {mood.mood}
              </li>
            ))}
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
