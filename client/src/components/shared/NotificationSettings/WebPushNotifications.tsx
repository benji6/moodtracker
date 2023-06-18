import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner, Toggle } from "eri";
import { queryClient } from "../../..";
import {
  webPushTokensDelete,
  webPushTokensList,
  webPushTokensPost,
} from "../../../api";
import { ERRORS } from "../../../constants";
import useWebPushToken, {
  NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE,
} from "../../hooks/useWebPushToken";
import { useEffect, useState } from "react";
import { captureException } from "../../../sentry";

export default function WebPushNotifications() {
  const { data, isError, isLoading } = useQuery(
    ["web-push-tokens"],
    webPushTokensList
  );
  const {
    error: tokenError,
    token,
    isLoading: isTokenLoading,
  } = useWebPushToken();
  const [shouldPostToken, setShouldPostToken] = useState(false);

  const isEnabled = Boolean(data?.tokens.find(({ token: t }) => t === token));
  const deleteMutation = useMutation(webPushTokensDelete, {
    onSuccess: (_, token) => {
      queryClient.setQueryData<typeof data>(["web-push-tokens"], (data) => ({
        tokens: data!.tokens.filter((t) => t.token !== token),
      }));
    },
  });
  const postMutation = useMutation(webPushTokensPost, {
    onSuccess: (t) => {
      queryClient.setQueryData<typeof data>(["web-push-tokens"], (data) => ({
        tokens: data ? [...data.tokens, t] : [t],
      }));
    },
  });

  useEffect(() => {
    if (!shouldPostToken || !token) return;
    postMutation.mutate(token);
    setShouldPostToken(false);
  }, [postMutation, shouldPostToken, token]);

  let registrationTokenErrorMessage: undefined | string;
  if (tokenError) {
    if (
      tokenError.message === NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE ||
      tokenError.message.includes("messaging/permission-blocked")
    )
      registrationTokenErrorMessage =
        "Notifications permission is disabled - you need to enable it to use this feature";
    else if (tokenError.message === "Registration failed - push service error")
      registrationTokenErrorMessage =
        "Something went wrong, you may need to use a different browser or try again later";
    else {
      registrationTokenErrorMessage =
        "Something went wrong, please try again later";
      captureException(tokenError);
    }
  }

  const isSomethingLoading =
    isLoading ||
    isTokenLoading ||
    deleteMutation.isLoading ||
    postMutation.isLoading;

  return (
    <>
      <h3>Daily push notifications</h3>
      <p>
        Opt in to receive daily push notifications that remind you to log your
        mood. Note that your phone will need an internet connection to receive
        push notifications.
      </p>
      <Toggle
        checked={isEnabled}
        disabled={isSomethingLoading}
        error={
          registrationTokenErrorMessage ??
          (postMutation.isError || isError ? ERRORS.network : undefined)
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
