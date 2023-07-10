import * as React from "react";
import { useRef } from "react";
import * as ReactDOM from "react-dom";
import "./style.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  enabled: boolean;
}

const portalEl = document.getElementById("dimmer-portal") as HTMLDivElement;

export default function Dimmer({ enabled, ...rest }: Props) {
  const dimmerEl = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (enabled && dimmerEl.current) dimmerEl.current.requestFullscreen();
    else if (document.fullscreenElement) document.exitFullscreen();
  }, [enabled]);

  return ReactDOM.createPortal(
    <div
      {...rest}
      className={`m-dimmer${enabled ? " m-dimmer--enabled" : ""}`}
      ref={dimmerEl}
    >
      {enabled && (
        <span className="m-dimmer__text-container">
          <span className="m-dimmer__text">
            Tap, click or press escape to undim the screen
          </span>
        </span>
      )}
    </div>,
    portalEl,
  );
}
