import "./style.css";
import { Button, Icon, Paper } from "eri";
import { QuickTrackNavButton } from "./QuickTrackNavButton/QuickTrackNavButton";
import { TEST_IDS } from "../../../../constants";
import { useNavigate } from "react-router-dom";

export function QuickTrackNav() {
  const navigate = useNavigate();

  return (
    <Paper data-test-id={TEST_IDS.moodList}>
      <h2>Home</h2>
      <div className="quick-track-nav__links">
        <Button onClick={() => navigate("/add")}>
          <Icon margin="end" name="heart" />
          Add mood
        </Button>
        {(["sleeps", "weights"] as const).map((eventType) => (
          <QuickTrackNavButton key={eventType} eventType={eventType} />
        ))}
        <Button onClick={() => navigate("/meditation")}>
          <Icon margin="end" name="bell" />
          Meditate
        </Button>
        {(["push-ups", "sit-ups", "leg-raises"] as const).map((eventType) => (
          <QuickTrackNavButton key={eventType} eventType={eventType} />
        ))}
      </div>
    </Paper>
  );
}
