import { Button, Paper } from "eri";
import { useNavigate } from "react-router";

export default function GetStartedCta() {
  const navigate = useNavigate();

  return (
    <Paper>
      <h2>Welcome to MoodTracker!</h2>
      <Button.Group>
        <Button onClick={() => navigate(`/moods/add`)} type="button">
          Add your first mood!
        </Button>
      </Button.Group>
    </Paper>
  );
}
