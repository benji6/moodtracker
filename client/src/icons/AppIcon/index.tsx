import "./style.css";
import { HtmlHTMLAttributes } from "react";

export default function AppIcon(props: HtmlHTMLAttributes<SVGElement>) {
  return (
    <svg
      {...props}
      className="m-app-icon"
      viewBox="0 0 1 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="gradient">
          <stop
            offset="25%"
            stopColor="light-dark(hsl(210, 100%, 22%), hsl(195, 100%, 66.7%))"
          />
          <stop offset="95%" stopColor="hsl(210,100%,44.35%)" />
        </linearGradient>
        <filter id="shadow">
          <feDropShadow dx="-0.01" dy="0.00" stdDeviation="0.005" />
        </filter>
      </defs>
      <g filter="url(#shadow)">
        <mask id="circles-mask">
          <rect x="0" y="0" width="100" height="100" fill="white" />
          <circle
            cx=".5"
            cy=".5"
            r=".065"
            stroke="black"
            strokeWidth="0.04"
            fill="none"
          />
          <circle
            cx=".5"
            cy=".5"
            r=".167"
            stroke="black"
            strokeWidth="0.045"
            fill="none"
          />
          <circle
            cx=".5"
            cy=".5"
            r=".29"
            stroke="black"
            strokeWidth="0.05"
            fill="none"
          />
        </mask>
        <circle
          cx=".5"
          cy=".5"
          r=".4"
          strokeWidth="0"
          fill="url(#gradient)"
          mask="url(#circles-mask)"
        />
      </g>
    </svg>
  );
}
