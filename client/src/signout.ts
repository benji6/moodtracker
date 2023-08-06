import { queryClient } from ".";
import { webPushTokensDelete } from "./api";
import { userPool } from "./cognito";
import { getRegistrationToken } from "./firebase";
import { captureException } from "./sentry";
import store, { slicesToClearOnLogout } from "./store";

export default async function signOut(currentUser = userPool.getCurrentUser()) {
  const { state } = await navigator.permissions.query({
    name: "notifications",
  });
  if (state === "granted") {
    const token = await getRegistrationToken();
    try {
      await webPushTokensDelete(token);
    } catch (e) {
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
