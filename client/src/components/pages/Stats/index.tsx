import { Link, RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MonthlyAverages from "./MonthlyAverages";
import WeeklyAverages from "./WeeklyAverages";
import { eventsSelector, moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";
import MoodChartForWeek from "./MoodChartForWeek";
import { startOfWeek } from "date-fns";
import { WEEK_OPTIONS } from "../../../formatters";

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

  const week = startOfWeek(new Date(), WEEK_OPTIONS);

  return (
    <Paper.Group>
      <Paper>
        <h2>Mood this week</h2>
        <MoodChartForWeek week={week} />
      </Paper>
      <Paper>
        <p className="center">
          <Link to="/stats/explore">Explore</Link>
        </p>
      </Paper>
      <WeeklyAverages />
      <MonthlyAverages />
    </Paper.Group>
  );
}
