import { useSelector } from "react-redux";
import WebPushNotifications from "./WebPushNotifications";
import WeeklyEmailNotifications from "./WeeklyEmailNotifications";
import { userIdSelector } from "../../../selectors";
import { useEffect, useState } from "react";

const ALLOWED_USER_ID_HASH =
  "683ecc0205360fbc4ccaf47e2f6069c58004570e500fdc75dcd10036d9b0b968";

const sha256Hash = async (input: string) => {
  const hashBuffer = await window.crypto.subtle.digest(
    "SHA-256",
    new TextEncoder().encode(input)
  );
  return Array.from(new Uint8Array(hashBuffer))
    .map((item) => item.toString(16).padStart(2, "0"))
    .join("");
};

export default function NotificationSettings() {
  const userId = useSelector(userIdSelector)!;
  const [shouldShowWebPush, setShouldShowWebPush] = useState(false);

  useEffect(() => {
    sha256Hash(userId).then((hash) => {
      if (hash === ALLOWED_USER_ID_HASH) setShouldShowWebPush(true);
    });
  }, [userId]);

  return (
    <>
      {/* TODO remove this when feature is complete */}
      {shouldShowWebPush && <WebPushNotifications />}
      <WeeklyEmailNotifications />
    </>
  );
}
