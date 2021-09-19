import { Spinner, Toggle } from "eri";
import * as React from "react";
import {
  weeklyEmailsDisable,
  weeklyEmailsEnable,
  weeklyEmailsGet,
} from "../../api";
import { ERRORS } from "../../constants";

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
          const enabled = await weeklyEmailsGet();
          setIsWeeklyEmailsEnabled(enabled);
        } catch {
          setError(true);
        }
      })(),
    []
  );

  return (
    <Toggle
      checked={isWeeklyEmailsEnabled}
      disabled={isUpdating}
      error={error ? ERRORS.network : undefined}
      onChange={async () => {
        setIsUpdating(true);
        if (error) setError(false);
        try {
          if (isWeeklyEmailsEnabled) {
            await weeklyEmailsDisable();
            setIsWeeklyEmailsEnabled(false);
          } else {
            await weeklyEmailsEnable();
            setIsWeeklyEmailsEnabled(true);
          }
        } catch {
          setError(true);
        }
        setIsUpdating(false);
      }}
      label={
        isUpdating || isWeeklyEmailsEnabled === undefined ? (
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
