import { useCallback, useEffect, useRef, useState } from "react";

interface WakeLock {
  enable(): void;
  disable(): void;
}

export default function useWakeLock(): WakeLock | undefined {
  const [wakeLockSentinel, setWakeLockSentinel] = useState<WakeLockSentinel>();
  const wakeLockRef = useRef<WakeLock>();

  const enable = useCallback(() => {
    if (wakeLockSentinel && !wakeLockSentinel.released) return;
    navigator.wakeLock.request("screen").then(setWakeLockSentinel);
  }, [wakeLockSentinel]);

  const disable = useCallback(
    () => wakeLockSentinel?.release(),
    [wakeLockSentinel],
  );

  useEffect(() => () => void wakeLockSentinel?.release(), [wakeLockSentinel]);

  useEffect(() => {
    wakeLockRef.current = { enable, disable };
  }, [enable, disable]);

  return wakeLockRef.current;
}
