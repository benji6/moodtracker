import useInterval from "./useInterval";
import { useState } from "react";

interface UserActivation {
  hasBeenActive: boolean;
}

let userActivation: UserActivation;

if ("userActivation" in navigator) userActivation = navigator.userActivation;
else {
  // https://html.spec.whatwg.org/multipage/interaction.html#activation-triggering-input-event
  const ACTIVATION_TRIGGERING_INPUT_EVENTS: readonly Event["type"][] = [
    "keydown",
    "mousedown",
    "pointerdown", // only if pointerType is "mouse"
    "pointerup", // only if pointerType is "mouse"
    "touchend",
  ];
  userActivation = { hasBeenActive: false };
  const handleUserGesture = (e: Event) => {
    if (
      !e.isTrusted ||
      (e instanceof PointerEvent && e.pointerType !== "mouse")
    )
      return;
    userActivation.hasBeenActive = true;
    for (const inputType of ACTIVATION_TRIGGERING_INPUT_EVENTS)
      document.documentElement.removeEventListener(
        inputType,
        handleUserGesture,
      );
  };
  for (const inputType of ACTIVATION_TRIGGERING_INPUT_EVENTS)
    document.documentElement.addEventListener(inputType, handleUserGesture);
}

export default function useHasBeenActive() {
  const [hasBeenActive, setHasBeenActive] = useState(false);

  useInterval((clear) => {
    if (hasBeenActive || !userActivation.hasBeenActive) return;
    clear();
    setHasBeenActive(true);
  }, 1e2);

  return hasBeenActive;
}
