import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import Months from "./Months";
import Weeks from "./Weeks";
import {
  appIsStorageLoadingSelector,
  eventsSelector,
  moodsSelector,
} from "../../../selectors";
import { useSelector } from "react-redux";
import Years from "./Years";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);
  if (useSelector(appIsStorageLoadingSelector)) return <Spinner />;

  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <AddFirstMoodCta />
      </Paper.Group>
    );

  if (!events.hasLoadedFromServer) return <Spinner />;

  return (
    <Paper.Group>
      <Weeks />
      <Months />
      <Years />
      <Paper>
        <h2>Explore</h2>
        <p className="center">
          <Link to="/stats/explore">More insights here</Link>
        </p>
      </Paper>
    </Paper.Group>
  );
}
