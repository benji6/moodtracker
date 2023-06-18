import { initializeApp } from "firebase/app";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
import serviceWorkerRegistrationPromise from "./serviceWorkerRegistrationPromise";

const PUBLIC_VAPID_KEY =
  "BBhO8kx_ynJrYpotsDiOmkL46BWjWyDkKmaa9OntpGZV3rNM9Vc1fycZQpCUcF01pgHeIFXC2Sy7fFdmD82Hz9g";

const firebaseApp = initializeApp({
  apiKey: "AIzaSyDJUEfQvbke4ImRxqW5KwijugRKCzXw4BY",
  projectId: "moodtracker-4df02",
  messagingSenderId: "189351604256",
  appId: "1:189351604256:web:35457f768494fdf7e14c45",
});

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
