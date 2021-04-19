import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.css";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  enabled: boolean;
}

const portalEl = document.getElementById("dimmer-portal") as HTMLDivElement;

export default function Dimmer({ enabled, ...rest }: Props) {
  return ReactDOM.createPortal(
    <div
      {...rest}
      className={`m-dimmer${enabled ? " m-dimmer--enabled" : ""}`}
    />,
    portalEl
  );
}
