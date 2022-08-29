import * as React from "react";

export default function useKeyboardEscape(callback: () => void) {
  const savedCallback = React.useRef(callback);

  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.code === "Escape") {
        e.preventDefault();
        savedCallback.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // When the escape key is pressed in fullscreen mode
    // it is not captured by the keydown handler
    const handleExitFullscreen = () => {
      if (!document.fullscreenElement) savedCallback.current();
    };
    document.addEventListener("fullscreenchange", handleExitFullscreen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleExitFullscreen);
    };
  }, []);
}
