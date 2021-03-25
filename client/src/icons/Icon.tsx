import * as React from "react";

export default function MoodTrackerIcon(
  props: React.HtmlHTMLAttributes<SVGElement>
) {
  return (
    <svg
      {...props}
      stroke="#000"
      strokeWidth=".2"
      viewBox="0 0 10 10"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect height="10" stroke="none" width="10" fill="#fff" />
      <circle r="1.5" cx="3" cy="3" fill="#2575d0" />
      <circle r="1.5" cx="3" cy="7" fill="#3bd075" />
      <circle r="1.5" cx="7" cy="3" fill="#ffa033" />
      <circle r="1.5" cx="7" cy="7" fill="#ab58ff" />
    </svg>
  );
}
