import { RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import MoodStats from "./MoodStats";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MonthlyAverages from "./MonthlyAverages";
import WeeklyAverages from "./WeeklyAverages";
import AverageMoodByDay from "./AverageMoodByDay";
import AverageMoodByHour from "./AverageMoodByHour";
import { eventsSelector, moodsSelector } from "../../../selectors";
import { useSelector } from "react-redux";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const events = useSelector(eventsSelector);
  const moods = useSelector(moodsSelector);

  return (
    <Paper.Group>
      {events.hasLoadedFromServer ? (
        moods.allIds.length ? (
          <>
            <MoodStats />
            <WeeklyAverages />
            <MonthlyAverages />
            <AverageMoodByDay />
            <AverageMoodByHour />
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
