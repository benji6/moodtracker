import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import serviceWorkerRegistrationPromise from "./serviceWorkerRegistrationPromise";
import { FIREBASE_CONFIG } from "./constants";

const PUBLIC_VAPID_KEY =
  "BBhO8kx_ynJrYpotsDiOmkL46BWjWyDkKmaa9OntpGZV3rNM9Vc1fycZQpCUcF01pgHeIFXC2Sy7fFdmD82Hz9g";

const firebaseApp = initializeApp(FIREBASE_CONFIG);

const messaging = getMessaging(firebaseApp);
export const getRegistrationToken = async (): Promise<string> => {
  const serviceWorkerRegistration = await serviceWorkerRegistrationPromise;
  return getToken(messaging, {
    serviceWorkerRegistration,
    vapidKey: PUBLIC_VAPID_KEY,
  });
};

onMessage(messaging, (payload) => {
  const notification = payload.notification!;

  new Notification(notification.title!, {
    badge: notification.icon,
    icon: notification.icon,
    body: notification.body,
    lang: "en",
  });
});
