import * as React from "react";
import { Button, Paper } from "eri";
import { useNavigate } from "@reach/router";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";

export default function GetStartedCta() {
  const navigate = useNavigate();

  return (
    <Paper>
      <h2>Welcome to MoodTracker!</h2>
      <h3>First set up your notifications</h3>
      <p>
        Opt in to receive an email update every Monday morning with your own
        personal weekly mood report!
      </p>
      <WeeklyEmailNotifications />
      <h3>Now get started adding moods</h3>
      <Button.Group>
        <Button onClick={() => navigate(`/add`)} type="button">
          Add your first mood!
        </Button>
      </Button.Group>
    </Paper>
  );
}
