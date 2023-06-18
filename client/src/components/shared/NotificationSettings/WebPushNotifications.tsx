import { useMutation, useQuery } from "@tanstack/react-query";
import { Spinner, Toggle } from "eri";
import { queryClient } from "../../..";
import {
  webPushTokensDelete,
  webPushTokensList,
  webPushTokensPost,
} from "../../../api";
import { ERRORS } from "../../../constants";
import useWebPushToken from "../../hooks/useWebPushToken";

export default function WebPushNotifications() {
  const { data, isError, isLoading } = useQuery(
    ["web-push-tokens"],
    webPushTokensList
  );

  const { token, isLoading: isTokenLoading } = useWebPushToken();
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
        disabled={isSomethingLoading || !token}
        error={postMutation.isError || isError ? ERRORS.network : undefined}
        onChange={() => {
          if (!token) return; // toggle will be disabled in this case but TS does not know that;
          if (isEnabled) deleteMutation.mutate(token);
          else postMutation.mutate(token);
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
