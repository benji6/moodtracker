import MoodBar from "./MoodBar";
import { oneDecimalPlaceFormatter } from "../../formatters/numberFormatters";

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
