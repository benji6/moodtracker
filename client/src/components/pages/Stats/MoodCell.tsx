import * as React from "react";
import { MOOD_RANGE } from "../../../constants";
import { moodToColor } from "../../../utils";

const moodFormatter = Intl.NumberFormat(undefined, {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

interface Props {
  mood: number;
}

export default function MoodCell({ mood }: Props) {
  return (
    <td style={{ textAlign: "center" }}>
      <span>{moodFormatter.format(mood)}</span>
      <div
        style={{
          background: "var(--e-color-ground-less)",
          borderRadius: "var(--e-border-radius-0)",
          height: "var(--e-space-0)",
        }}
      >
        <div
          style={{
            background: moodToColor(mood / MOOD_RANGE[1]),
            borderRadius: "var(--e-border-radius-0)",
            height: "100%",
            width: `${mood * MOOD_RANGE[1]}%`,
          }}
        />
      </div>
    </td>
  );
}
