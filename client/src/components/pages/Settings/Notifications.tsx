import NotificationSettings from "../../shared/NotificationSettings";
import { Paper } from "eri";

export default function Notifications() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Notifications</h2>
        <NotificationSettings />
      </Paper>
    </Paper.Group>
  );
}
