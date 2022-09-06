import { Paper } from "eri";
import DailyNotifications from "../../shared/DailyNotifications";
import WeeklyEmailNotifications from "../../shared/WeeklyEmailNotifications";

export default function Notifications() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Notifications</h2>
        <WeeklyEmailNotifications />
        <h3>Daily notifications</h3>
        <DailyNotifications />
      </Paper>
    </Paper.Group>
  );
}
