// TODO there are lots of `any`s in this file that need removing when types are updated
import { Spinner, Toggle } from "eri";
import { useState } from "react";
import {
  PERIODIC_BACKGROUND_SYNC_DAILY_NOTIFICATION_TAG,
  TIME,
} from "../../constants";
import usePermissionState from "../hooks/usePermissionState";

export default function DailyNotifications() {
  const [dailyNotificationsState, setDailyNotificationsState] = useState<
    "enabled" | "error" | "disabled" | "loading"
  >("disabled");
  const pbsPermissionState = usePermissionState(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    "periodic-background-sync" as any
  );
  const notificationPermissionState = usePermissionState("notifications");

  return (
    <>
      <h3>Daily notifications</h3>
      {"Notification" in window ? (
        <>
          <p>
            Opt in to receive daily push notifications reminding you to log your
            mood.
          </p>
          <p>
            This is an experimental feature that may not work correctly (or at
            all!). Right now there is no way to configure the time of day you
            will receive the notifications.
          </p>
          <p>
            {/* TODO we may add a prompt upon sign in which will obviate the need for this message */}
            You will have to enable this separately for each browser and device
            you use.
          </p>
          <Toggle
            checked={dailyNotificationsState === "enabled"}
            disabled={dailyNotificationsState === "loading"}
            error={
              notificationPermissionState === "denied"
                ? "Notification permission denied, if you want to use this feature you will need to enable this permission in your browser"
                : pbsPermissionState === "denied"
                ? "Periodic background sync permission denied, if you want to use this feature you will need to ensure the app is installed to your device and all requested permissions are enabled. If that doesn't work then try a different browser"
                : dailyNotificationsState === "error"
                ? "Something went wrong, check the app is installed and the requested permissions are granted. If that doesn't work please try a different browser"
                : undefined
            }
            onChange={async () => {
              setDailyNotificationsState("loading");

              if (dailyNotificationsState === "enabled") {
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                const registration: any = await navigator.serviceWorker.ready;
                registration.periodicSync.unregister(
                  PERIODIC_BACKGROUND_SYNC_DAILY_NOTIFICATION_TAG
                );
                setDailyNotificationsState("disabled");
                return;
              }

              const notificationPermission =
                await Notification.requestPermission();

              if (notificationPermission !== "granted") {
                setDailyNotificationsState("disabled");
                return;
              }

              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              const registration: any = await navigator.serviceWorker.ready;
              try {
                await registration.periodicSync.register(
                  PERIODIC_BACKGROUND_SYNC_DAILY_NOTIFICATION_TAG,
                  {
                    minInterval: TIME.secondsPerDay * 1e3,
                  }
                );
                setDailyNotificationsState("enabled");
              } catch (e) {
                setDailyNotificationsState("error");
              }
            }}
            label={
              dailyNotificationsState === "loading" ? (
                <span>
                  <Spinner inline />
                </span>
              ) : (
                `Daily push notifications ${
                  dailyNotificationsState === "enabled" ? "en" : "dis"
                }abled`
              )
            }
          />
        </>
      ) : (
        <p className="negative">
          Notifications not available in this browser, please try a newer
          browser if you&apos;d like to use this feature.
        </p>
      )}
    </>
  );
}
