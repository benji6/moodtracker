import { useEffect, useState } from "react";

const MEDIA_QUERY = "(prefers-color-scheme: dark)";
const mediaQueryList = window.matchMedia(MEDIA_QUERY);

export default function useDarkMode() {
  const [darkMode, setDarkMode] = useState(
    window.matchMedia(MEDIA_QUERY).matches,
  );

  useEffect(() => {
    const handler = (e: MediaQueryListEvent) => setDarkMode(e.matches);
    mediaQueryList.addEventListener("change", handler);
    return () => mediaQueryList.removeEventListener("change", handler);
  }, []);

  return darkMode;
}
