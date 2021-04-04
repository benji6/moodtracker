import { Link } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import GetStartedCta from "../../shared/GetStartedCta";
import Months from "./Months";
import Weeks from "./Weeks";
import { eventsSelector, normalizedMoodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import Years from "./Years";
import MoodGradientForPeriod from "./MoodGradientForPeriod";

export default function Overview() {
  const events = useSelector(eventsSelector);
  const moods = useSelector(normalizedMoodsSelector);

  if (!moods.allIds.length)
    return (
      <Paper.Group>
        <GetStartedCta />
      </Paper.Group>
    );

  if (!events.hasLoadedFromServer) return <Spinner />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Overview</h2>
        <MoodGradientForPeriod
          fromDate={new Date(moods.allIds[0])}
          toDate={new Date(moods.allIds[moods.allIds.length - 1])}
        />
      </Paper>
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
