import * as React from "react";
import "./style.css";

export default function MoodTrackerIcon(
  props: React.HtmlHTMLAttributes<SVGElement>
) {
  return (
    <svg
      {...props}
      className="m-icon"
      viewBox="0 0 1 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="gradient">
          <stop offset="0" stopColor="var(--m-icon-color)" />
          <stop offset=".05" stopColor="var(--m-icon-color)" />
          <stop offset=".15" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".2" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".28" stopColor="var(--m-icon-color)" />
          <stop offset=".32" stopColor="var(--m-icon-color)" />
          <stop offset=".4" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".45" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".54" stopColor="var(--m-icon-color)" />
          <stop offset=".6" stopColor="var(--m-icon-color)" />
          <stop offset=".69" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".75" stopColor="var(--m-icon-color)" stopOpacity="0" />
          <stop offset=".84" stopColor="var(--m-icon-color)" />
          <stop offset=".91" stopColor="var(--m-icon-color)" />
          <stop offset="1" stopColor="var(--m-icon-color)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <circle r=".4" cx=".5" cy=".5" fill="url(#gradient)" />
    </svg>
  );
}
