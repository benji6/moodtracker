import { RouteComponentProps } from "@reach/router";
import { Paper, Spinner } from "eri";
import * as React from "react";
import { StateContext } from "../../AppState";
import MoodChart from "./MoodChart";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import AddFirstMoodCta from "../../shared/AddFirstMoodCta";
import MonthlyAverages from "./MonthlyAverages";
import WeeklyAverages from "./WeeklyAverages";
import AverageMoodByDay from "./AverageMoodByDay";

export default function Stats(_: RouteComponentProps) {
  useRedirectUnauthed();
  const state = React.useContext(StateContext);

  return (
    <Paper.Group>
      {state.events.hasLoadedFromServer ? (
        state.moods.allIds.length ? (
          <>
            <MoodChart />
            <WeeklyAverages />
            <MonthlyAverages />
            <AverageMoodByDay />
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
