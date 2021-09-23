import * as React from "react";
import { Button, Paper } from "eri";
import { useNavigate } from "@reach/router";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";
import LocationToggle from "./LocationToggle";

export default function GetStartedCta() {
  const navigate = useNavigate();

  return (
    <Paper>
      <h2>Welcome to MoodTracker!</h2>
      <h3>Notification settings</h3>
      <p>
        Opt in to receive an email update every Monday morning with your own
        personal weekly mood report!
      </p>
      <WeeklyEmailNotifications />
      <h3>Location settings</h3>
      <p>
        Opt in to record your location against all your events so you can see
        where you were when you look back through your history.
      </p>
      <LocationToggle />
      <h3>Get started adding moods</h3>
      <Button.Group>
        <Button onClick={() => navigate(`/add`)} type="button">
          Add your first mood!
        </Button>
      </Button.Group>
    </Paper>
  );
}
