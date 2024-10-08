import MoodCell from "./MoodCell";
import { computeMean } from "../../utils";

interface Props {
  moodsByLocation: Record<string, number[]>;
}

export default function MoodByLocationTable({ moodsByLocation }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Location</th>
          <th>Total moods</th>
          <th>Average mood</th>
        </tr>
      </thead>
      <tbody>
        {[...Object.entries(moodsByLocation)]
          .sort((a, b) => b[1].length - a[1].length)
          .map(([location, moods]) => (
            <tr key={location}>
              <td>{location}</td>
              <td>{moods.length}</td>
              <MoodCell mood={computeMean(moods)} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}
