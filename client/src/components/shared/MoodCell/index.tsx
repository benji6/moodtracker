import { MOOD_RANGE } from "../../../constants";
import { oneDecimalPlaceFormatter } from "../../../numberFormatters";
import { moodToColor } from "../../../utils";
import "./style.css";

interface Props {
  mood: number;
}

export default function MoodCell({ mood }: Props) {
  return (
    <td className="center">
      <span>{oneDecimalPlaceFormatter.format(mood)}</span>
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
