import "./style.css";
import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface Props {
  enabled: boolean;
  onUndim(): void;
}

const portalEl = document.getElementById("dimmer-portal") as HTMLDivElement;

export default function Dimmer({ enabled, onUndim }: Props) {
  const dimmerEl = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // TODO can remove `?.` once API is supported on iPhone https://caniuse.com/?search=requestfullscreen
    if (enabled && dimmerEl.current) dimmerEl.current.requestFullscreen?.();
    else if (document.fullscreenElement) document.exitFullscreen();
  }, [enabled]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent): void => {
      if (document.fullscreenElement) {
        e.preventDefault();
        document.exitFullscreen();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // When the escape key is pressed in fullscreen mode
    // the browser uses it to exit fullscreen mode and
    // it is not captured by the keydown handler.
    // so any key press will exit fullscreen mode and
    // app state will be handled by `handleExitFullscreen`
    const handleExitFullscreen = () => {
      if (!document.fullscreenElement) onUndim();
    };
    document.addEventListener("fullscreenchange", handleExitFullscreen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("fullscreenchange", handleExitFullscreen);
    };
  }, [onUndim]);

  return createPortal(
    // Neither eslint rule is relevant in this case
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
    <div
      className={`m-dimmer${enabled ? " m-dimmer--enabled" : ""}`}
      onClick={onUndim}
      ref={dimmerEl}
    >
      {enabled && (
        <span className="m-dimmer__text-container">
          <span className="m-dimmer__text">
            Tap, click or press any key to undim the screen
          </span>
        </span>
      )}
    </div>,
    portalEl,
  );
}
