import store, { slicesToClearOnLogout } from "./store";
import { captureException } from "./sentry";
import { getRegistrationToken } from "./firebase";
import { queryClient } from ".";
import { userPool } from "./cognito";
import { webPushTokensDelete } from "./api";

export default async function signOut(currentUser = userPool.getCurrentUser()) {
  const { state } = await navigator.permissions.query({
    name: "notifications",
  });
  if (state === "granted") {
    try {
      const token = await getRegistrationToken();
      await webPushTokensDelete(token);
    } catch (e) {
      if (
        !(e instanceof Error) ||
        e.message !== "Firebase messaging is not supported in this browser"
      )
        captureException(e);
    }
  }
  await new Promise<void>((resolve) => {
    if (currentUser) return currentUser.signOut(resolve);
    resolve();
  });
  for (const slice of slicesToClearOnLogout)
    store.dispatch(slice.actions.clear());
  queryClient.clear();
}
