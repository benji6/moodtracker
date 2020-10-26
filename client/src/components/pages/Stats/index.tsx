import { RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodStats from "./MoodStats";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MonthlyAverages from "./MonthlyAverages";
import WeeklyAverages from "./WeeklyAverages";
import AverageMoodByDay from "./AverageMoodByDay";
import AverageMoodByHour from "./AverageMoodByHour";
import { moodsSelector } from "../../../selectors";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const state = React.useContext(StateContext);
  const moods = moodsSelector(state);

  return (
    <Paper.Group>
      {state.events.hasLoadedFromServer ? (
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
