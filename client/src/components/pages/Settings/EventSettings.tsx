import EventTrackingSettings from "../../shared/EventTrackingSettings";
import { Paper } from "eri";

export default function EventSettings() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Event settings</h2>
        <EventTrackingSettings />
      </Paper>
    </Paper.Group>
  );
}
