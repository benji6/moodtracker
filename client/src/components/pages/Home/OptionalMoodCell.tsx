import MoodCell from "../../shared/MoodCell";

export default function OptionalMoodCell({ mood }: { mood?: number }) {
  return mood === undefined ? (
    <td className="center">N/A</td>
  ) : (
    <MoodCell mood={mood} />
  );
}
