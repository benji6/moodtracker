import { Spinner, Toggle } from "eri";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import useWebPushToken, {
  NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE,
} from "../../hooks/useWebPushToken";
import {
  webPushTokensDelete,
  webPushTokensList,
  webPushTokensPut,
} from "../../../api";
import { ERRORS } from "../../../constants";
import { captureException } from "../../../sentry";
import { queryClient } from "../../..";

export default function WebPushNotifications() {
  const { data, isError, isPending } = useQuery({
    queryKey: ["web-push-tokens"],
    queryFn: webPushTokensList,
  });
  const {
    error: tokenError,
    token,
    isLoading: isTokenLoading,
  } = useWebPushToken();
  const [shouldPostToken, setShouldPostToken] = useState(false);

  const isEnabled = Boolean(data?.tokens.find(({ token: t }) => t === token));
  const deleteMutation = useMutation({
    mutationFn: webPushTokensDelete,
    onSuccess: (_, token) => {
      queryClient.setQueryData<typeof data>(["web-push-tokens"], (data) => ({
        tokens: data!.tokens.filter((t) => t.token !== token),
      }));
    },
  });
  const putMutation = useMutation({
    mutationFn: webPushTokensPut,
    onSuccess: (tokenObject) => {
      queryClient.setQueryData<typeof data>(["web-push-tokens"], (data) => ({
        tokens: data ? [...data.tokens, tokenObject] : [tokenObject],
      }));
    },
  });

  useEffect(() => {
    if (!shouldPostToken || !token) return;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;
    putMutation.mutate({ createdAt, token, updatedAt });
    setShouldPostToken(false);
  }, [putMutation, shouldPostToken, token]);

  let registrationTokenErrorMessage: undefined | string;
  if (tokenError) {
    if (
      tokenError.message === NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE ||
      tokenError.message.includes("messaging/permission-blocked")
    )
      registrationTokenErrorMessage =
        "Notifications permission is disabled - you will not receive any notifications unless you enable it";
    else if (
      tokenError.message === "Registration failed - push service error"
    ) {
      registrationTokenErrorMessage =
        "Something went wrong, you may need to use a different browser or try again later";
      captureException(tokenError);
    } else {
      registrationTokenErrorMessage =
        "Something went wrong, please try again later";
      captureException(tokenError);
    }
  }

  const isSomethingLoading =
    isPending ||
    isTokenLoading ||
    deleteMutation.isPending ||
    putMutation.isPending;

  return (
    <>
      <p>
        Opt in to receive daily push notifications that remind you to log your
        mood.
      </p>
      <p>
        <small>
          You will need to set this up separately on each device you use
          MoodTracker on and your device will need an internet connection to
          receive push notifications.
        </small>
      </p>
      <Toggle
        checked={isEnabled}
        disabled={isSomethingLoading}
        error={
          registrationTokenErrorMessage ??
          (putMutation.isError || isError ? ERRORS.network : undefined)
        }
        onChange={() => {
          if (!token) {
            Notification.requestPermission().then((permission) => {
              if (permission === "granted") setShouldPostToken(true);
            });
            return;
          }
          if (isEnabled) deleteMutation.mutate(token);
          else setShouldPostToken(true);
        }}
        label={
          isSomethingLoading ? (
            <span>
              <Spinner inline />
            </span>
          ) : (
            `Daily push notifications ${isEnabled ? "en" : "dis"}abled`
          )
        }
      />
    </>
  );
}
