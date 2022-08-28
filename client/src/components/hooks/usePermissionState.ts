import { useState } from "react";
import useInterval from "./useInterval";

export default function usePermissionState(name: PermissionName) {
  const [permissionState, setPermissionState] = useState<
    PermissionState | undefined
  >();

  useInterval(() => {
    navigator.permissions
      .query({ name })
      .then(({ state }) => setPermissionState(state));
  }, 1e2);

  return permissionState;
}
