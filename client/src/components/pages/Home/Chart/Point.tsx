import * as React from "react";
import { POINT_SIZE } from "./constants";

interface Props {
  title: string;
  x: number;
  y: number;
}

export default function Point({ title, x, y }: Props) {
  return (
    <div
      style={{
        background: "var(--e-color-theme)",
        borderRadius: "50%",
        height: POINT_SIZE,
        position: "absolute",
        width: POINT_SIZE,
        left: `${x * 100}%`,
        bottom: `${y * 100}%`,
      }}
      title={title}
    />
  );
}
