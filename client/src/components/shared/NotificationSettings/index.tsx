import WebPushNotifications from "./WebPushNotifications";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";

export default function NotificationSettings() {
  return (
    <>
      <h3>Daily push notifications</h3>
      <WebPushNotifications />
      <WeeklyEmailNotifications />
    </>
  );
}
