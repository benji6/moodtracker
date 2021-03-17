import { Spinner, Toggle } from "eri";
import * as React from "react";
import { useSelector } from "react-redux";
import {
  disableWeeklyEmails,
  enableWeeklyEmails,
  getWeeklyEmails,
} from "../../api";
import { NETWORK_ERROR_MESSAGE } from "../../constants";
import { appIsStorageLoadingSelector } from "../../selectors";

export default function WeeklyEmailNotifications() {
  const [isUpdating, setIsUpdating] = React.useState(false);
  const [isWeeklyEmailsEnabled, setIsWeeklyEmailsEnabled] = React.useState<
    boolean | undefined
  >();
  const [error, setError] = React.useState(false);
  React.useEffect(
    () =>
      void (async () => {
        const enabled = await getWeeklyEmails();
        setIsWeeklyEmailsEnabled(enabled);
      })(),
    []
  );
  const isAppStorageLoading = useSelector(appIsStorageLoadingSelector);

  return (
    <Toggle
      checked={isWeeklyEmailsEnabled}
      disabled={isUpdating}
      error={error ? NETWORK_ERROR_MESSAGE : undefined}
      onChange={async () => {
        setIsUpdating(true);
        if (error) setError(false);
        if (isWeeklyEmailsEnabled) {
          try {
            await disableWeeklyEmails();
            setIsWeeklyEmailsEnabled(false);
          } catch {
            setError(true);
          }
        } else {
          try {
            await enableWeeklyEmails();
            setIsWeeklyEmailsEnabled(true);
          } catch {
            setError(true);
          }
        }
        setIsUpdating(false);
      }}
      label={
        isAppStorageLoading ||
        isUpdating ||
        isWeeklyEmailsEnabled === undefined ? (
          <span>
            <Spinner inline />
          </span>
        ) : (
          "Weekly email notifications"
        )
      }
    />
  );
}
