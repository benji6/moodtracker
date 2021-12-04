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
  periodType: "day" | "month" | "week" | "year";
  previousPeriod?: PeriodData;
}

export default function MoodSummary({
  currentPeriod,
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
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Average mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.mean} />}
          <OptionalMoodCell mood={currentPeriod.mean} />
        </tr>
        <tr>
          <td>Best mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.best} />}
          <OptionalMoodCell mood={currentPeriod.best} />
        </tr>
        <tr>
          <td>Worst mood</td>
          {previousPeriod && <OptionalMoodCell mood={previousPeriod.worst} />}
          <OptionalMoodCell mood={currentPeriod.worst} />
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
          </tr>
        )}
      </tbody>
    </table>
  );
}
