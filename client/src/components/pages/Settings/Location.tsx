import { Paper } from "eri";
import LocationToggle from "../../shared/LocationToggle";

export default function Location() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Location</h2>
        <LocationToggle />
      </Paper>
    </Paper.Group>
  );
}
