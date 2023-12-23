import { Button, Paper } from "eri";
import NotificationSettings from "./NotificationSettings";
import { useNavigate } from "react-router-dom";

export default function GetStartedCta() {
  const navigate = useNavigate();

  return (
    <Paper>
      <h2>Welcome to MoodTracker!</h2>
      <NotificationSettings />
      <h3>Get started adding moods</h3>
      <Button.Group>
        <Button onClick={() => navigate(`/add`)} type="button">
          Add your first mood!
        </Button>
      </Button.Group>
    </Paper>
  );
}
