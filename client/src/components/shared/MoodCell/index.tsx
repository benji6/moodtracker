import * as React from "react";
import { MOOD_RANGE } from "../../../constants";
import { moodFormatter } from "../../../formatters";
import { moodToColor } from "../../../utils";
import "./style.css";

interface Props {
  mood: number;
}

export default function MoodCell({ mood }: Props) {
  return (
    <td className="center">
      <span>{moodFormatter.format(mood)}</span>
      <div className="m-mood-cell__bar-container">
        <div
          className="m-mood-cell__bar br-0"
          style={{
            background: moodToColor(mood),
            width: `${mood * MOOD_RANGE[1]}%`,
          }}
        />
      </div>
    </td>
  );
}
