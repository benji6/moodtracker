import { oneDecimalPlaceFormatter } from "../../numberFormatters";
import MoodBar from "./MoodBar";

interface Props {
  mood: number;
}

export default function MoodCell({ mood }: Props) {
  return (
    <td className="center">
      <span>{oneDecimalPlaceFormatter.format(mood)}</span>
      <MoodBar mood={mood} />
    </td>
  );
}
