import { formatSecondsAsTime } from "../../../../../../utils";
import "./style.css";

const RING_THICKNESS = 1 / 9;
const RADIUS = 2 / 5 - RING_THICKNESS / 2;
const CIRCUMFERENCE = 2 * RADIUS * Math.PI;
const TEXT_LENGTH = (RADIUS - RING_THICKNESS) * 2;
const TEXT_X = 0.5 - RADIUS + RING_THICKNESS;

interface Props {
  remainingSeconds: number;
  totalSeconds: number;
}

export default function MeditationTimerClock({
  remainingSeconds,
  totalSeconds,
}: Props) {
  return (
    <svg
      aria-label="Time remaining"
      viewBox="0 0 1 1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        cx="0.5"
        cy="0.5"
        fill="transparent"
        r={RADIUS}
        stroke="var(--color-ground)"
        strokeWidth={RING_THICKNESS}
      />
      <circle
        className="meditation-timer-clock__circle"
        cx="0.5"
        cy="0.5"
        fill="transparent"
        r={RADIUS}
        stroke="var(--color-theme)"
        strokeDasharray={CIRCUMFERENCE}
        strokeDashoffset={(remainingSeconds / totalSeconds) * CIRCUMFERENCE}
        strokeWidth={RING_THICKNESS}
      />
      <text
        className="meditation-timer-clock__text"
        fill="var(--color-figure)"
        dy="0.06"
        fontSize="0.18"
        lengthAdjust="spacingAndGlyphs"
        textLength={TEXT_LENGTH}
        x={TEXT_X}
        y="0.5"
      >
        {formatSecondsAsTime(remainingSeconds)}
      </text>
    </svg>
  );
}
