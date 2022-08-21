import { Paper } from "eri";
import WeeklyEmailNotifications from "../../shared/WeeklyEmailNotifications";

export default function Notifications() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Notifications</h2>
        <WeeklyEmailNotifications />
      </Paper>
    </Paper.Group>
  );
}
