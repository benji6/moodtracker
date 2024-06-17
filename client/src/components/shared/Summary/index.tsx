import "./style.css";
import {
  formatMinutesToDurationStringShort,
  formatSecondsToOneNumberWithUnits,
} from "../../../formatters/formatDuration";
import SummaryItem from "./SummaryItem";
import eventsSlice from "../../../store/eventsSlice";
import { formatMetersToOneNumberWithUnits } from "../../../formatters/formatDistance";
import { oneDecimalPlaceFormatter } from "../../../formatters/numberFormatters";
import { useSelector } from "react-redux";

interface PeriodData {
  best?: number;
  mean?: number;
  meanSleep?: number;
  meanWeight?: number;
  runMeters: number;
  runSeconds: number;
  secondsMeditated: number;
  standardDeviation?: number;
  total: number;
  totalLegRaises: number;
  totalPushUps: number;
  totalSitUps: number;
  worst?: number;
}

interface Props {
  currentPeriod: PeriodData;
  periodType?: "day" | "month" | "week" | "year";
  previousPeriod?: PeriodData;
  showMeditationStatsOverride?: boolean;
}

export default function Summary({
  currentPeriod,
  periodType,
  previousPeriod,
  showMeditationStatsOverride = false,
}: Props) {
  const showMeditationStats: boolean =
    useSelector(eventsSlice.selectors.hasMeditations) &&
    Boolean(currentPeriod.secondsMeditated || previousPeriod?.secondsMeditated);
  const showTotalMoodsRecorded: boolean = Boolean(
    currentPeriod.total || previousPeriod?.total,
  );

  return (
    <div className="m-summary">
      <SummaryItem
        currentValue={currentPeriod.mean}
        format={oneDecimalPlaceFormatter.format}
        displayTrendSentiment
        heading="Average mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.mean}
      />
      <SummaryItem
        currentValue={currentPeriod.best}
        displayTrendSentiment
        heading="Best mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.best}
      />
      <SummaryItem
        currentValue={currentPeriod.worst}
        displayTrendSentiment
        heading="Worst mood"
        isMood
        periodType={periodType}
        previousValue={previousPeriod?.worst}
      />
      {showTotalMoodsRecorded && (
        <SummaryItem
          currentValue={currentPeriod.total}
          heading="Moods recorded"
          periodType={periodType}
          previousValue={previousPeriod?.total}
        />
      )}
      {Boolean(currentPeriod.standardDeviation) && (
        <SummaryItem
          currentValue={currentPeriod.standardDeviation}
          format={oneDecimalPlaceFormatter.format}
          heading="Mood standard deviation"
          periodType={periodType}
          previousValue={previousPeriod?.standardDeviation}
        />
      )}
      <SummaryItem
        currentValue={currentPeriod.meanSleep}
        format={formatMinutesToDurationStringShort}
        heading={periodType === "day" ? "Sleep" : " Average sleep"}
        periodType={periodType}
        previousValue={previousPeriod?.meanSleep}
      />
      <SummaryItem
        currentValue={currentPeriod.meanWeight}
        format={oneDecimalPlaceFormatter.format}
        heading="Average weight"
        periodType={periodType}
        previousValue={previousPeriod?.meanWeight}
        units="kg"
      />
      {(showMeditationStatsOverride || showMeditationStats) && (
        <SummaryItem
          currentValue={currentPeriod.secondsMeditated}
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
          heading="Leg raises"
          periodType={periodType}
          previousValue={previousPeriod?.totalLegRaises}
        />
      )}
    </div>
  );
}
