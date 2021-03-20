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
        try {
          const enabled = await getWeeklyEmails();
          setIsWeeklyEmailsEnabled(enabled);
        } catch {
          setError(true);
        }
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
        try {
          if (isWeeklyEmailsEnabled) {
            await disableWeeklyEmails();
            setIsWeeklyEmailsEnabled(false);
          } else {
            await enableWeeklyEmails();
            setIsWeeklyEmailsEnabled(true);
          }
        } catch {
          setError(true);
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
