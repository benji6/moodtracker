import * as React from "react";

export default function MoodTrackerIcon(
  props: React.HtmlHTMLAttributes<SVGElement>
) {
  return (
    <svg {...props} viewBox="0 0 1 1" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="gradient">
          <stop offset="0" stopColor="hsl(195,100%,50%)" />
          <stop offset=".01" stopColor="hsl(195,100%,50%)" />
          <stop offset=".15" stopColor="#040606" />
          <stop offset=".2" stopColor="#040606" />
          <stop offset=".3" stopColor="hsl(195,100%,50%)" />
          <stop offset=".4" stopColor="#040606" />
          <stop offset=".45" stopColor="#040606" />
          <stop offset=".57" stopColor="hsl(195,100%,50%)" />
          <stop offset=".69" stopColor="#040606" />
          <stop offset=".75" stopColor="#040606" />
          <stop offset=".875" stopColor="hsl(195,100%,50%)" />
          <stop offset="1" stopColor="#040606" />
        </radialGradient>
      </defs>
      <rect fill="#040606" height="1" stroke="none" width="1" />
      <circle r=".4" cx=".5" cy=".5" fill="url(#gradient)" />
    </svg>
  );
}
