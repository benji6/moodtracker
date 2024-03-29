import { useEffect, useState } from "react";
import { getRegistrationToken } from "../../firebase";
import usePermissionState from "./usePermissionState";

export const NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE =
  "Notifications permission denied";

export default function useWebPushToken(): {
  error: Error | undefined;
  token: string | undefined;
  isLoading: boolean;
} {
  const [token, setToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const permissionState = usePermissionState("notifications");
  const [error, setError] = useState<undefined | Error>();

  useEffect(() => {
    if (permissionState === "denied")
      return setError(Error(NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE));
    if (error?.message === NOTIFICATIONS_PERMISSION_DENIED_ERROR_MESSAGE)
      setError(undefined);
    if (error) return;
    if (permissionState === "granted") {
      setIsLoading(true);
      getRegistrationToken()
        .then(setToken)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  }, [error, permissionState]);

  return { error, isLoading, token };
}
