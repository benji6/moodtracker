import { Paper } from "eri";
import LocationToggle from "../../shared/LocationToggle";

export default function Location() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Location</h2>
        <p>
          Opt in to record your location alongside all the events you record in
          MoodTracker.
        </p>
        <LocationToggle />
      </Paper>
    </Paper.Group>
  );
}
