import { Paper } from "eri";
import NotificationSettings from "../../shared/NotificationSettings";

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
