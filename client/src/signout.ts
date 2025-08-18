import store, { slicesToClearOnLogout } from "./store";
import { QUERY_KEYS } from "./constants";
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

  for (const [k, v] of Object.entries(QUERY_KEYS)) {
    // Trivial to retain `usage` since it is only 1 value. It is also in browser cache, so it doesn't really matter either way.
    // `reverseGeolocation` is likely to intersect between users (since the browser is tied to a single device) and is not sensitive.
    // `weather` is not sensitive either, however, there is far more of it
    // since it is temporal as well as spatial, so intersection between users
    // is unlikely. Also this data is in the browser cache unlike the
    // `reverseGelolcation` data.
    if (k === "reverseGeolocation" || k === "usage") continue;
    queryClient.removeQueries({ queryKey: [v] });
  }
}
