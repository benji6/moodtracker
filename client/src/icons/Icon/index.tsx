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
          <stop offset="0" stopColor="var(--m-icon-color-theme)" />
          <stop offset=".01" stopColor="var(--m-icon-color-theme)" />
          <stop
            offset=".15"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop
            offset=".2"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop offset=".3" stopColor="var(--m-icon-color-theme)" />
          <stop
            offset=".4"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop
            offset=".45"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop offset=".57" stopColor="var(--m-icon-color-theme)" />
          <stop
            offset=".69"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop
            offset=".75"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
          <stop offset=".875" stopColor="var(--m-icon-color-theme)" />
          <stop
            offset="1"
            stopColor="var(--m-icon-color-theme)"
            stopOpacity="0"
          />
        </radialGradient>
      </defs>
      <circle r=".4" cx=".5" cy=".5" fill="url(#gradient)" />
    </svg>
  );
}
