import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import Months from "./Months";
import Weeks from "./Weeks";
import { eventsSelector, moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);

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
      <Paper>
        <h2>Explore</h2>
        <p className="center">
          <Link to="/stats/explore">More insights here</Link>
        </p>
      </Paper>
    </Paper.Group>
  );
}
