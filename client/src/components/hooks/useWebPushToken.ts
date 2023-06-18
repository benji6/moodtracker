import { useEffect, useState } from "react";
import { getRegistrationToken } from "../../firebase";

export default function useWebPushToken(): {
  token: string | undefined;
  isLoading: boolean;
} {
  const [token, setToken] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getRegistrationToken().then((t) => {
      setToken(t);
      setIsLoading(false);
    });
  });

  return { token, isLoading };
}
