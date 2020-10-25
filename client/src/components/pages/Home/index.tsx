import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodList from "./MoodList";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import { useSelector } from "react-redux";
import { userIsSignedInSelector } from "../../../selectors";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home(_: RouteComponentProps) {
  const state = React.useContext(StateContext);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  return (
    <Paper.Group>
      {userIsSignedIn ? (
        state.events.hasLoadedFromServer ? (
          state.moods.allIds.length ? (
            <MoodList />
          ) : (
            <AddFirstMoodCta />
          )
        ) : (
          <Spinner />
        )
      ) : (
        <Paper>
          <h2>Welcome to MoodTracker!</h2>
          <p>
            MoodTracker is a free and open source web app that lets you track
            your mood. It's simple to use, works offline and because it runs in
            your browser you can use it across all your devices!
          </p>
          <br />
          <p className="center">
            <strong>
              <Link to="/sign-up">Sign up now to get started!</Link>
            </strong>
          </p>
          <br />
          <p>
            <small>
              If you already have an account you can{" "}
              <Link to="/sign-in">sign in here</Link>.
            </small>
          </p>
        </Paper>
      )}
    </Paper.Group>
  );
}
