import { Link, NavigateFn, RouteComponentProps } from "@reach/router";
import { Paper, Fab, Icon, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodList from "./MoodList";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home({ navigate }: RouteComponentProps) {
  const state = React.useContext(StateContext);

  return (
    <Paper.Group>
      {state.user.email ? (
        <>
          {state.events.hasLoadedFromServer ? (
            state.moods.allIds.length ? (
              <MoodList navigate={navigate as NavigateFn} />
            ) : (
              <AddFirstMoodCta />
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
