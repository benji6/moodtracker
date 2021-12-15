import "./style.css";
import { MOOD_RANGE } from "../../../constants";
import { moodToColor } from "../../../utils";

interface Props {
  mood: number;
}

export default function MoodBar({ mood }: Props) {
  return (
    <div className="m-mood-bar br-0">
      <div
        className="m-mood-bar__bar br-0"
        style={{
          background: moodToColor(mood),
          width: `${mood * MOOD_RANGE[1]}%`,
        }}
      />
    </div>
  );
}
