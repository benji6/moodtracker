import { Button, Paper } from "eri";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";
import LocationToggle from "./LocationToggle";
import { useNavigate } from "react-router-dom";

export default function GetStartedCta() {
  const navigate = useNavigate();

  return (
    <Paper>
      <h2>Welcome to MoodTracker!</h2>
      <WeeklyEmailNotifications />
      <h3>Location settings</h3>
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
