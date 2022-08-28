import { Paper } from "eri";
import DailyNotifications from "../../shared/DailyNotifications";
import WeeklyEmailNotifications from "../../shared/WeeklyEmailNotifications";

export default function Notifications() {
  return (
    <Paper.Group>
      <Paper>
        <h2>Notifications</h2>
        <WeeklyEmailNotifications />
        <DailyNotifications />
      </Paper>
    </Paper.Group>
  );
}
