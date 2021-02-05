import * as React from "react";

let isMetaPressed = false;

window.addEventListener("blur", () => (isMetaPressed = false));

window.addEventListener("keydown", (e) => {
  if (e.key === "Meta") isMetaPressed = true;
});

window.addEventListener("keyup", (e) => {
  if (e.key === "Meta") isMetaPressed = false;
});

export default function useKeyboardSave(callback: () => void) {
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (
        (e.ctrlKey || isMetaPressed) &&
        (e.code === "Enter" || e.code === "KeyS")
      ) {
        e.preventDefault();
        savedCallback.current();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
