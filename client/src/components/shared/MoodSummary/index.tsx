import "./style.css";
import { useSelector } from "react-redux";
import { hasMeditationsSelector } from "../../../selectors";
import MoodSummaryItem from "./MoodSummaryItem";
import { TIME } from "../../../constants";

interface PeriodData {
  best?: number;
  mean?: number;
  meanWeight?: number;
  secondsMeditated: number;
  standardDeviation?: number;
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
        decimalPlaces={1}
        displayTrendSentiment
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
        currentValue={currentPeriod.total}
        displayTrendSentiment
        heading="Moods recorded"
        periodType={periodType}
        previousValue={previousPeriod?.total}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.standardDeviation}
        decimalPlaces={1}
        heading="Mood standard deviation"
        periodType={periodType}
        previousValue={previousPeriod?.standardDeviation}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.meanWeight}
        decimalPlaces={1}
        heading="Average weight"
        periodType={periodType}
        previousValue={previousPeriod?.meanWeight}
        units="kg"
      />
      {(showMeditationStatsOverride || showMeditationStats) && (
        <MoodSummaryItem
          currentValue={
            currentPeriod.secondsMeditated /
            (currentPeriod.secondsMeditated >= TIME.secondsPerHour
              ? TIME.secondsPerHour
              : TIME.secondsPerMinute)
          }
          decimalPlaces={1}
          displayTrendSentiment
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
