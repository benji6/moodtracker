import * as React from "react";
import { MOOD_RANGE } from "../../constants";
import { moodFormatter } from "../../formatters";
import { moodToColor } from "../../utils";

interface Props {
  mood: number;
}

export default function MoodCell({ mood }: Props) {
  return (
    <td style={{ textAlign: "center" }}>
      <span>{moodFormatter.format(mood)}</span>
      <div
        style={{
          background: "var(--color-ground-less)",
          borderRadius: "var(--border-radius-0)",
          height: "var(--space-0)",
        }}
      >
        <div
          style={{
            background: moodToColor(mood),
            borderRadius: "var(--border-radius-0)",
            height: "100%",
            width: `${mood * MOOD_RANGE[1]}%`,
          }}
        />
      </div>
    </td>
  );
}
