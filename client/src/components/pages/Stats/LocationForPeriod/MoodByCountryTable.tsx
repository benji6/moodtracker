import MoodCell from "../../../shared/MoodCell";
import { computeMean } from "../../../../utils";

interface Props {
  moodsByCountry: Record<string, number[]>;
}

export default function MoodByCountryTable({ moodsByCountry }: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Country</th>
          <th>Total moods</th>
          <th>Average mood</th>
        </tr>
      </thead>
      <tbody>
        {[...Object.entries(moodsByCountry)]
          .sort((a, b) => b[1].length - a[1].length)
          .map(([moodsByCountry, moods]) => (
            <tr key={moodsByCountry}>
              <td>{moodsByCountry}</td>
              <td>{moods.length}</td>
              <MoodCell mood={computeMean(moods)} />
            </tr>
          ))}
      </tbody>
    </table>
  );
}
