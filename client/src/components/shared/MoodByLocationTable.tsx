import { computeMean } from "../../utils";
import MoodCell from "./MoodCell";

interface Props {
  moodsByLocation: { [location: string]: number[] };
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
          .sort((a, b) => a[0].localeCompare(b[0]))
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
