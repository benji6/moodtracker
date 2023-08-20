import WebPushNotifications from "./WebPushNotifications";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";

export default function NotificationSettings() {
  return (
    <>
      <WebPushNotifications />
      <WeeklyEmailNotifications />
    </>
  );
}
