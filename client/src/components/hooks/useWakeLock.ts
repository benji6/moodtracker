import { useCallback, useEffect, useState } from "react";

export default function useWakeLock() {
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel>();

  useEffect(() => () => void wakeLockSentinel?.release(), [wakeLockSentinel]);

  return {
    enable: useCallback(() => {
      if (wakeLockSentinel && !wakeLockSentinel.released) return;
      navigator.wakeLock.request("screen").then(setWakeLockSentinel);
    }, [wakeLockSentinel]),
    disable: useCallback(() => wakeLockSentinel?.release(), [wakeLockSentinel]),
  };
}
