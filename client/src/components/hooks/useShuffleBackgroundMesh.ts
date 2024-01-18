import { useEffect, useRef } from "react";
import { shuffleBackgroundMesh } from "eri";
import { useLocation } from "react-router-dom";

export function useShuffleBackgroundMesh() {
  const { pathname } = useLocation();
  const lastPathnameRef = useRef<string | undefined>();
  useEffect(() => {
    if (
      lastPathnameRef.current !== undefined &&
      lastPathnameRef.current !== pathname
    )
      shuffleBackgroundMesh();
    lastPathnameRef.current = pathname;
  }, [pathname]);
}
