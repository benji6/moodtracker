import { RouteComponentProps, useNavigate } from "@reach/router";
import { Fab, Icon, Paper, Spinner } from "eri";
import * as React from "react";
import MoodList from "./MoodList";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import { useSelector } from "react-redux";
import {
  eventsSelector,
  moodsSelector,
  userIsSignedInSelector,
} from "../../../selectors";
import NotSignedIn from "./NotSignedIn";

export interface HomeState {
  dayCount: number | undefined;
  page: number;
}

export default function Home(_: RouteComponentProps) {
  const navigate = useNavigate();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
  const userIsSignedIn = useSelector(userIsSignedInSelector);

  if (!userIsSignedIn) return <NotSignedIn />;

  return (
    <Paper.Group>
      {events.hasLoadedFromServer ? (
        moods.allIds.length ? (
          <>
            <MoodList />{" "}
            <Fab onClick={() => navigate(`/add`)}>
              <Icon name="plus" size="4" />
              Add mood
            </Fab>
          </>
        ) : (
          <AddFirstMoodCta />
        )
      ) : (
        <Spinner />
      )}
    </Paper.Group>
  );
}
