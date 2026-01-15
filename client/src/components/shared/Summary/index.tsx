import "./style.css";
import {
  formatMinutesAsTime,
  formatSecondsToOneNumberWithUnits,
} from "../../../formatters/formatDuration";
import {
  kilogramFormatter,
  oneDecimalPlaceFormatter,
} from "../../../formatters/numberFormatters";
import SummaryItem from "./SummaryItem";
import eventsSlice from "../../../store/eventsSlice";
import { formatMetersToOneNumberWithUnits } from "../../../formatters/formatDistance";
import { useSelector } from "react-redux";

interface PeriodData {
  best?: number;
  mean?: number;
  meanSleep?: number;
  meanWeight?: number;
  mssd?: number;
  runMeters: number;
  runSeconds: number;
  secondsMeditated?: number;
  standardDeviation?: number;
  totalLegRaises: number;
  totalPushUps: number;
  totalSitUps: number;
  worst?: number;
}

interface Props {
  currentPeriod: PeriodData;
  periodsSinceLastHighOrLow?: {
    count: number;
    isAllTime: boolean;
    isBest: boolean;
  };
  periodType?: "day" | "month" | "week" | "year";
  previousPeriod?: PeriodData;
  showMeditationStatsOverride?: boolean;
}

export default function Summary({
  currentPeriod,
  periodsSinceLastHighOrLow,
  periodType,
  previousPeriod,
  showMeditationStatsOverride = false,
}: Props) {
  const showMeditationStats: boolean =
    useSelector(eventsSlice.selectors.hasMeditations) &&
    Boolean(currentPeriod.secondsMeditated || previousPeriod?.secondsMeditated);

  return (
    <div className="m-summary">
      <SummaryItem
        currentValue={currentPeriod.mean}
        displayTrendSentiment
        eventType="moods"
        format={oneDecimalPlaceFormatter.format}
        heading="Average mood"
        periodsSinceLastHighOrLow={periodsSinceLastHighOrLow}
        periodType={periodType}
        previousValue={previousPeriod?.mean}
        showMoodUi
      />
      <SummaryItem
        currentValue={currentPeriod.best}
        displayTrendSentiment
        eventType="moods"
        heading="Best mood"
        periodType={periodType}
        previousValue={previousPeriod?.best}
        showMoodUi
      />
      <SummaryItem
        currentValue={currentPeriod.worst}
        displayTrendSentiment
        eventType="moods"
        heading="Lowest mood"
        periodType={periodType}
        previousValue={previousPeriod?.worst}
        showMoodUi
      />
      {Boolean(currentPeriod.standardDeviation) && (
        <SummaryItem
          currentValue={currentPeriod.standardDeviation}
          eventType="moods"
          format={oneDecimalPlaceFormatter.format}
          heading="Mood standard deviation"
          periodType={periodType}
          previousValue={previousPeriod?.standardDeviation}
        />
      )}
      {Boolean(currentPeriod.mssd) && (
        <SummaryItem
          currentValue={currentPeriod.mssd}
          eventType="moods"
          format={oneDecimalPlaceFormatter.format}
          heading="Mood instability (MSSD)"
          periodType={periodType}
          previousValue={previousPeriod?.mssd}
        />
      )}
      <SummaryItem
        currentValue={currentPeriod.meanSleep}
        eventType="sleeps"
        format={formatMinutesAsTime}
        heading={periodType === "day" ? "Sleep" : " Average sleep"}
        periodType={periodType}
        previousValue={previousPeriod?.meanSleep}
      />
      <SummaryItem
        currentValue={currentPeriod.meanWeight}
        eventType="weights"
        format={kilogramFormatter.format}
        heading="Average weight"
        periodType={periodType}
        previousValue={previousPeriod?.meanWeight}
      />
      {(showMeditationStatsOverride || showMeditationStats) && (
        <SummaryItem
          currentValue={currentPeriod.secondsMeditated}
          eventType="meditations"
          displayTrendSentiment
          format={formatSecondsToOneNumberWithUnits}
          heading="Meditation time"
          periodType={periodType}
          previousValue={previousPeriod?.secondsMeditated}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.runMeters || previousPeriod.runMeters
          : currentPeriod.runMeters,
      ) && (
        <SummaryItem
          currentValue={currentPeriod.runMeters}
          displayTrendSentiment
          eventType="runs"
          heading="Run distance"
          format={formatMetersToOneNumberWithUnits}
          periodType={periodType}
          previousValue={previousPeriod?.runMeters}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.runSeconds || previousPeriod.runSeconds
          : currentPeriod.runSeconds,
      ) && (
        <SummaryItem
          currentValue={currentPeriod.runSeconds}
          displayTrendSentiment
          eventType="runs"
          format={formatSecondsToOneNumberWithUnits}
          heading="Run time"
          periodType={periodType}
          previousValue={previousPeriod?.runSeconds}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.totalPushUps || previousPeriod.totalPushUps
          : currentPeriod.totalPushUps,
      ) && (
        <SummaryItem
          currentValue={currentPeriod.totalPushUps}
          displayTrendSentiment
          eventType="push-ups"
          heading="Push-ups"
          periodType={periodType}
          previousValue={previousPeriod?.totalPushUps}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.totalSitUps || previousPeriod.totalSitUps
          : currentPeriod.totalSitUps,
      ) && (
        <SummaryItem
          currentValue={currentPeriod.totalSitUps}
          displayTrendSentiment
          eventType="sit-ups"
          heading="Sit-ups"
          periodType={periodType}
          previousValue={previousPeriod?.totalSitUps}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.totalLegRaises || previousPeriod.totalLegRaises
          : currentPeriod.totalLegRaises,
      ) && (
        <SummaryItem
          currentValue={currentPeriod.totalLegRaises}
          displayTrendSentiment
          eventType="leg-raises"
          heading="Leg raises"
          periodType={periodType}
          previousValue={previousPeriod?.totalLegRaises}
        />
      )}
    </div>
  );
}
