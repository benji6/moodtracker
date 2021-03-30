import { Paper } from "eri";
import * as React from "react";
import WeeklyEmailNotifications from "../../shared/WeeklyEmailNotifications";

export default function Notifications() {
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
