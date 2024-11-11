import "./style.css";
import { Button, Icon, Paper } from "eri";
import { QuickTrackNavButton } from "./QuickTrackNavButton";
import { TEST_IDS } from "../../../../constants";
import appSlice from "../../../../store/appSlice";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

export function QuickTrackNav() {
  const navigate = useNavigate();
  const eventTypeTracking = useSelector(appSlice.selectors.eventTypeTracking);

  return (
    <Paper data-test-id={TEST_IDS.moodList}>
      <h2 className="quick-track-nav__heading">
        Home
        <div className="quick-track-nav__settings-icon">
          <Link to="/settings/events">
            <Icon name="settings" />
          </Link>
        </div>
      </h2>
      <div className="quick-track-nav__links">
        {(["moods", "sleeps", "weights"] as const)
          .filter((eventType) => eventTypeTracking[eventType])
          .map((eventType) => (
            <QuickTrackNavButton key={eventType} eventType={eventType} />
          ))}
        {eventTypeTracking.meditations && (
          <Button onClick={() => navigate("/meditation")}>
            <Icon margin="end" name="bell" />
            Meditate
          </Button>
        )}
        {(["runs", "push-ups", "sit-ups", "leg-raises"] as const)
          .filter((eventType) => eventTypeTracking[eventType])
          .map((eventType) => (
            <QuickTrackNavButton key={eventType} eventType={eventType} />
          ))}
      </div>
    </Paper>
  );
}
