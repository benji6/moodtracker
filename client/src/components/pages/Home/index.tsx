import { Link, NavigateFn, RouteComponentProps } from "@reach/router";
import { Paper, Fab, Icon, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodGraph from "./MoodGraph";
import MoodList from "./MoodList";

export default function Home({ navigate }: RouteComponentProps) {
  const state = React.useContext(StateContext);

  return (
    <Paper.Group>
      {state.userEmail ? (
        <>
          {state.events.hasLoadedFromServer ? (
            state.moods.allIds.length ? (
              <>
                <MoodGraph moods={state.moods} />
                <MoodList
                  moods={state.moods}
                  navigate={navigate as NavigateFn}
                />
              </>
            ) : (
              <>
                <p>Welcome to MoodTracker!</p>
                <p>
                  <Link to="add">Click here to add your first mood</Link>
                </p>
              </>
            )
          ) : (
            <Spinner />
          )}
          <Fab
            aria-label="add new mood"
            onClick={() => (navigate as NavigateFn)("add")}
          >
            <Icon name="plus" size="4" />
          </Fab>
        </>
      ) : (
        <Paper>
          <h2>Welcome to MoodTracker!</h2>
          <p>
            MoodTracker is a free and open source web app that lets you track
            your mood. It's simple to use, works offline and because it runs in
            your browser you can use it across all your devices!
          </p>
          <br />
          <p e-util="center">
            <strong>
              <Link to="sign-up">Sign up now to get started!</Link>
            </strong>
          </p>
          <br />
          <p>
            <small>
              If you already have an account you can{" "}
              <Link to="sign-in">sign in here</Link>.
            </small>
          </p>
        </Paper>
      )}
    </Paper.Group>
  );
}
