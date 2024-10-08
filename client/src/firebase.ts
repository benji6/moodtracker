import {
  Messaging,
  getMessaging,
  getToken,
  isSupported,
  onMessage,
} from "firebase/messaging";
import { FIREBASE_CONFIG } from "./constants";
import { initializeApp } from "firebase/app";

const PUBLIC_VAPID_KEY =
  "BBhO8kx_ynJrYpotsDiOmkL46BWjWyDkKmaa9OntpGZV3rNM9Vc1fycZQpCUcF01pgHeIFXC2Sy7fFdmD82Hz9g";

const firebaseApp = initializeApp(FIREBASE_CONFIG);

const messagingPromise: Promise<Messaging | undefined> = isSupported().then(
  (supported) => {
    if (!supported) return;
    const messaging = getMessaging(firebaseApp);
    onMessage(messaging, (payload) => {
      const notification = payload.notification;
      if (!notification) throw Error("notification is undefined");
      if (!notification.title) throw Error("notification.title is undefined");
      new Notification(notification.title, {
        badge: notification.icon,
        icon: notification.icon,
        body: notification.body,
        lang: "en",
      });
    });
    return messaging;
  },
);

export const getRegistrationToken = async (): Promise<string> => {
  const messaging = await messagingPromise;
  if (!messaging)
    throw Error("Firebase messaging is not supported in this browser");
  return getToken(messaging, {
    serviceWorkerRegistration: await navigator.serviceWorker.ready,
    vapidKey: PUBLIC_VAPID_KEY,
  });
};
