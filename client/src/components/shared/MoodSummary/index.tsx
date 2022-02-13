import "./style.css";
import { useSelector } from "react-redux";
import {
  integerFormatter,
  oneDecimalPlaceFormatter,
} from "../../../numberFormatters";
import { hasMeditationsSelector } from "../../../selectors";
import MoodSummaryItem from "./MoodSummaryItem";
import { TIME } from "../../../constants";

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
  showMeditationStatsOverride?: boolean;
}

export default function MoodSummary({
  currentPeriod,
  periodType,
  previousPeriod,
  showMeditationStatsOverride = false,
}: Props) {
  const showMeditationStats = useSelector(hasMeditationsSelector);

  return (
    <div className="m-mood-summary">
      <MoodSummaryItem
        currentValue={currentPeriod.mean}
        displayTrendSentiment
        format={oneDecimalPlaceFormatter.format}
        heading="Average mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.mean}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.best}
        displayTrendSentiment
        heading="Best mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.best}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.worst}
        displayTrendSentiment
        heading="Worst mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.worst}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.standardDeviation}
        format={oneDecimalPlaceFormatter.format}
        heading="Standard deviation"
        periodType={periodType}
        previousValue={previousPeriod?.standardDeviation}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.total}
        displayTrendSentiment
        format={integerFormatter.format}
        heading="Moods recorded"
        periodType={periodType}
        previousValue={previousPeriod?.total}
      />
      {(showMeditationStatsOverride || showMeditationStats) && (
        <MoodSummaryItem
          currentValue={
            currentPeriod.secondsMeditated /
            (currentPeriod.secondsMeditated >= TIME.secondsPerHour
              ? TIME.secondsPerHour
              : TIME.secondsPerMinute)
          }
          displayTrendSentiment
          format={oneDecimalPlaceFormatter.format}
          heading={`${
            currentPeriod.secondsMeditated >= TIME.secondsPerHour
              ? "Hours"
              : "Minutes"
          } meditated`}
          periodType={periodType}
          previousValue={
            previousPeriod
              ? previousPeriod.secondsMeditated /
                (currentPeriod.secondsMeditated >= TIME.secondsPerHour
                  ? TIME.secondsPerHour
                  : TIME.secondsPerMinute)
              : undefined
          }
        />
      )}
    </div>
  );
}
