import { Redirect } from "@reach/router";
import { Paper } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import { normalizedMeditationsSelector } from "../../../../selectors";
import MeditationLog from "./MeditationLog";
import MeditationStats from "./MeditationStats";

export default function Meditation() {
  const meditations = useSelector(normalizedMeditationsSelector);

  if (!meditations.allIds.length) return <Redirect to="/404" />;

  return (
    <Paper.Group>
      <Paper>
        <h2>Meditation stats</h2>
      </Paper>
      <MeditationStats />
      <MeditationLog />
    </Paper.Group>
  );
}
