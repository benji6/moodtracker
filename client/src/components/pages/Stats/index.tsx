import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MonthlyAverages from "./MonthlyAverages";
import WeeklyAverages from "./WeeklyAverages";
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
      <Paper>
        <h2>Explore</h2>
        <p className="center">
          <Link to="/stats/explore">More insights here</Link>
        </p>
      </Paper>
      <WeeklyAverages />
      <MonthlyAverages />
    </Paper.Group>
  );
}
