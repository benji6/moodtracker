import * as React from "react";
import MoodCell from "../pages/Stats/MoodCell";

const OptionalMoodCell = ({ mood }: { mood?: number }) =>
  mood === undefined ? (
    <td className="center">N/A</td>
  ) : (
    <MoodCell mood={mood} />
  );

interface PeriodData {
  best?: number;
  mean?: number;
  standardDeviation: number;
  total: number;
  worst?: number;
}

interface Props {
  currentPeriod: PeriodData;
  nextPeriod?: PeriodData;
  periodType: "month" | "week" | "year";
  previousPeriod?: PeriodData;
}

export default function MoodSummary({
  currentPeriod,
  nextPeriod,
  periodType,
  previousPeriod,
}: Props) {
  return (
    <table>
      <thead>
        <tr>
          <th>Stat</th>
          {previousPeriod && <th>Last {periodType}</th>}
          <th>This {periodType}</th>
          {nextPeriod && <th>Next {periodType}</th>}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Average mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.mean} />}
          <OptionalMoodCell mood={currentPeriod.mean} />
          {nextPeriod && <OptionalMoodCell mood={nextPeriod.mean} />}
        </tr>
        <tr>
          <td>Best mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.best} />}
          <OptionalMoodCell mood={currentPeriod.best} />
          {nextPeriod && <OptionalMoodCell mood={nextPeriod.best} />}
        </tr>
        <tr>
          <td>Worst mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.worst} />}
          <OptionalMoodCell mood={currentPeriod.worst} />
          {nextPeriod && <OptionalMoodCell mood={nextPeriod.worst} />}
        </tr>
        <tr>
          <td>Standard deviation</td>
          {previousPeriod && (
            <td className="center">
              {previousPeriod.standardDeviation.toFixed(1)}
            </td>
          )}
          <td className="center">
            {currentPeriod.standardDeviation.toFixed(1)}
          </td>
          {nextPeriod && (
            <td className="center">
              {nextPeriod.standardDeviation.toFixed(1)}
            </td>
          )}
        </tr>
        <tr>
          <td>Total moods recorded</td>
          {previousPeriod && <td className="center">{previousPeriod.total}</td>}
          <td className="center">{currentPeriod.total}</td>
          {nextPeriod && <td className="center">{nextPeriod.total}</td>}
        </tr>
      </tbody>
    </table>
  );
}
