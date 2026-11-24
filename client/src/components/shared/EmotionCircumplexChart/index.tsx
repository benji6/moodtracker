import "./style.css";
import {
  integerFormatter,
  percentFormatter,
} from "../../../formatters/numberFormatters";
import { EmotionPoint } from "./types";
import { useId } from "react";

const CENTER = 240;
const RADIUS = 200;
const MAX_POINT_RADIUS = 14;
const QUADRANTS = [
  { label: "Unpleasant, high energy", rotation: 270, x: 65, y: 65 },
  { label: "Pleasant, high energy", rotation: 0, x: 415, y: 65 },
  { label: "Unpleasant, low energy", rotation: 180, x: 65, y: 425 },
  { label: "Pleasant, low energy", rotation: 90, x: 415, y: 425 },
] as const;

interface Props {
  points: readonly EmotionPoint[];
  quadrants: readonly { label: string; proportion: number }[];
}

export default function EmotionCircumplexChart({ points, quadrants }: Props) {
  const id = useId();
  const maxCount = Math.max(...points.map(({ count }) => count), 1);
  const proportions = new Map(
    quadrants.map(({ label, proportion }) => [label, proportion]),
  );

  return (
    <figure className="m-emotion-circumplex">
      <svg
        aria-labelledby={`${id}-title ${id}-description`}
        className="m-emotion-circumplex__plot"
        preserveAspectRatio="xMidYMid meet"
        role="img"
        viewBox="0 0 480 480"
      >
        <title id={`${id}-title`}>Emotion words by valence and arousal</title>
        <desc id={`${id}-description`}>
          Pleasant words are on the right, unpleasant words on the left. Higher
          arousal is at the top and lower arousal at the bottom. Bubble area
          shows the number of entries mentioning each emotion. Dots are labeled
          with emotion names, and exact counts are available in their titles.
          Quadrant shading shows the share of emotion matches on a fixed scale
          from 0% to 100%.{" "}
          {QUADRANTS.map(
            ({ label }) =>
              `${label}: ${percentFormatter.format(proportions.get(label) ?? 0)}.`,
          ).join(" ")}
        </desc>
        {QUADRANTS.map(({ label, rotation, x, y }) => {
          const proportion = proportions.get(label) ?? 0;
          return (
            <g key={label}>
              <title>{`${label}: ${percentFormatter.format(proportion)} of emotion matches`}</title>
              <path
                className="m-emotion-circumplex__quadrant"
                d="M 240 240 L 240 40 A 200 200 0 0 1 440 240 Z"
                fillOpacity={proportion * 0.25}
                transform={`rotate(${rotation} ${CENTER} ${CENTER})`}
              />
              <text
                className="m-emotion-circumplex__quadrant-share"
                textAnchor="middle"
                x={x}
                y={y}
              >
                {percentFormatter.format(proportion)}
              </text>
            </g>
          );
        })}
        <g className="m-emotion-circumplex__guides">
          <circle cx={CENTER} cy={CENTER} r={RADIUS} />
          <line
            x1={CENTER - RADIUS}
            x2={CENTER + RADIUS}
            y1={CENTER}
            y2={CENTER}
          />
          <line
            x1={CENTER}
            x2={CENTER}
            y1={CENTER - RADIUS}
            y2={CENTER + RADIUS}
          />
        </g>
        <g className="m-emotion-circumplex__labels">
          <text textAnchor="middle" x={CENTER} y="20">
            High arousal
          </text>
          <text textAnchor="middle" x={CENTER} y="472">
            Low arousal
          </text>
          <text
            className="m-emotion-circumplex__valence-label"
            textAnchor="middle"
            transform="rotate(-90 16 240)"
            x="16"
            y={CENTER}
          >
            Unpleasant
          </text>
          <text
            className="m-emotion-circumplex__valence-label"
            textAnchor="middle"
            transform="rotate(90 464 240)"
            x="464"
            y={CENTER}
          >
            Pleasant
          </text>
        </g>
        {points.map(({ id, label, valence, arousal, count }) => {
          const x = CENTER + valence * RADIUS;
          const y = CENTER - arousal * RADIUS;
          const radius = MAX_POINT_RADIUS * Math.sqrt(count / maxCount);
          return (
            <g key={id}>
              <title>{`${label}: ${integerFormatter.format(count)} ${count === 1 ? "entry" : "entries"}`}</title>
              <circle
                className="m-emotion-circumplex__point"
                cx={x}
                cy={y}
                r={radius}
              />
              <text
                className="m-emotion-circumplex__emotion-label"
                textAnchor="middle"
                x={x}
                y={y - radius - 3}
              >
                {label}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption>
        <p>
          Bubble area represents the number of mood entries mentioning an
          emotion, scaled within this period. Arousal means activation or
          energy, not the strength of an emotion.
        </p>
        <p>
          Quadrant percentages show the share of emotion matches. Stronger
          background shading means a larger share, on a fixed scale from 0% to
          100%. Shares may not sum to 100% due to rounding.
        </p>
        <p>
          <strong>On an axis</strong>:{" "}
          {percentFormatter.format(proportions.get("On an axis") ?? 0)}. Valence
          or arousal is exactly zero; these matches are excluded from quadrant
          shading but included in the total.
        </p>
      </figcaption>
    </figure>
  );
}
