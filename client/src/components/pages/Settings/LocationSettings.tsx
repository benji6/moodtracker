import LocationToggle from "../../shared/LocationToggle";
import { Paper } from "eri";

export default function LocationSettings() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Location</h2>
        <LocationToggle />
      </Paper>
    </Paper.Group>
  );
}
