import { Link, RouteComponentProps, useNavigate } from "@reach/router";
import { Button, Paper, Spinner } from "eri";
import * as React from "react";
import MoodList from "./MoodList";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import { useSelector } from "react-redux";
import {
  eventsSelector,
  moodsSelector,
  userIsSignedInSelector,
} from "../../../selectors";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home(_: RouteComponentProps) {
  const navigate = useNavigate();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  return (
    <Paper.Group>
      {userIsSignedIn ? (
        events.hasLoadedFromServer ? (
          moods.allIds.length ? (
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
          <Button.Group>
            <Button onClick={() => navigate("/sign-up")} type="button">
              Sign up now to get started!
            </Button>
          </Button.Group>
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
