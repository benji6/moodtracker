import { RouteComponentProps } from "@reach/router";
import { Paper } from "eri";
import * as React from "react";
import useRedirectUnauthed from "../../hooks/useRedirectUnauthed";
import WeeklyEmailNotifications from "../../shared/WeeklyEmailNotifications";

export default function Notifications(_: RouteComponentProps) {
  useRedirectUnauthed();

  return (
    <Paper.Group>
      <Paper>
        <h2>Notifications</h2>
        <p>
          Opt in to receive an email update every Monday morning with your own
          personal weekly mood report!
        </p>
        <WeeklyEmailNotifications />
      </Paper>
    </Paper.Group>
  );
}
