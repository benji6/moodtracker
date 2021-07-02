import * as React from "react";
import { useSelector } from "react-redux";
import { formatDurationFromSeconds } from "../../dateTimeFormatters";
import {
  integerFormatter,
  oneDecimalPlaceFormatter,
} from "../../numberFormatters";
import { hasMeditationsSelector } from "../../selectors";
import OptionalMoodCell from "./OptionalMoodCell";

interface PeriodData {
  best?: number;
  mean?: number;
  secondsMeditated: number;
  standardDeviation: number;
  total: number;
  worst?: number;
}

interface Props {
  currentPeriod: PeriodData;
  nextPeriod?: PeriodData;
  periodType: "day" | "month" | "week" | "year";
  previousPeriod?: PeriodData;
}

export default function MoodSummary({
  currentPeriod,
  nextPeriod,
  periodType,
  previousPeriod,
}: Props) {
  const showMeditationStats = useSelector(hasMeditationsSelector);

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
              {oneDecimalPlaceFormatter.format(
                previousPeriod.standardDeviation
              )}
            </td>
          )}
          <td className="center">
            {oneDecimalPlaceFormatter.format(currentPeriod.standardDeviation)}
          </td>
          {nextPeriod && (
            <td className="center">
              {oneDecimalPlaceFormatter.format(nextPeriod.standardDeviation)}
            </td>
          )}
        </tr>
        <tr>
          <td>Total moods recorded</td>
          {previousPeriod && (
            <td className="center">
              {integerFormatter.format(previousPeriod.total)}
            </td>
          )}
          <td className="center">
            {integerFormatter.format(currentPeriod.total)}
          </td>
          {nextPeriod && (
            <td className="center">
              {integerFormatter.format(nextPeriod.total)}
            </td>
          )}
        </tr>
        {showMeditationStats && (
          <tr>
            <td>Time meditated</td>
            {previousPeriod && (
              <td className="center">
                {formatDurationFromSeconds(previousPeriod.secondsMeditated)}
              </td>
            )}
            <td className="center">
              {formatDurationFromSeconds(currentPeriod.secondsMeditated)}
            </td>
            {nextPeriod && (
              <td className="center">
                {formatDurationFromSeconds(nextPeriod.secondsMeditated)}
              </td>
            )}
          </tr>
        )}
      </tbody>
    </table>
  );
}
