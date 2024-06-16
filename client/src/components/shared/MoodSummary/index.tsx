import "./style.css";
import {
  formatMetersAsMetersOrKilometers,
  oneDecimalPlaceFormatter,
} from "../../../formatters/numberFormatters";
import MoodSummaryItem from "./MoodSummaryItem";
import { TIME } from "../../../constants";
import eventsSlice from "../../../store/eventsSlice";
import { formatMinutesAsTimeStringShort } from "../../../formatters/formatMinutesAsTimeString";
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

export default function MoodSummary({
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
    <div className="m-mood-summary">
      <MoodSummaryItem
        currentValue={currentPeriod.mean}
        format={oneDecimalPlaceFormatter.format}
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
      {showTotalMoodsRecorded && (
        <MoodSummaryItem
          currentValue={currentPeriod.total}
          heading="Moods recorded"
          periodType={periodType}
          previousValue={previousPeriod?.total}
        />
      )}
      {Boolean(currentPeriod.standardDeviation) && (
        <MoodSummaryItem
          currentValue={currentPeriod.standardDeviation}
          format={oneDecimalPlaceFormatter.format}
          heading="Mood standard deviation"
          periodType={periodType}
          previousValue={previousPeriod?.standardDeviation}
        />
      )}
      <MoodSummaryItem
        currentValue={currentPeriod.meanSleep}
        format={formatMinutesAsTimeStringShort}
        heading={periodType === "day" ? "Sleep" : " Average sleep"}
        periodType={periodType}
        previousValue={previousPeriod?.meanSleep}
      />
      <MoodSummaryItem
        currentValue={currentPeriod.meanWeight}
        format={oneDecimalPlaceFormatter.format}
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
      {Boolean(
        previousPeriod
          ? currentPeriod.runMeters || previousPeriod.runMeters
          : currentPeriod.runMeters,
      ) && (
        <MoodSummaryItem
          currentValue={currentPeriod.runMeters}
          displayTrendSentiment
          heading="Distance ran"
          format={formatMetersAsMetersOrKilometers}
          periodType={periodType}
          previousValue={previousPeriod?.runMeters}
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.runSeconds || previousPeriod.runSeconds
          : currentPeriod.runSeconds,
      ) && (
        <MoodSummaryItem
          currentValue={
            currentPeriod.runSeconds /
            (currentPeriod.runSeconds >= TIME.secondsPerHour
              ? TIME.secondsPerHour
              : TIME.secondsPerMinute)
          }
          displayTrendSentiment
          heading={`${
            currentPeriod.runSeconds >= TIME.secondsPerHour
              ? "Hours"
              : "Minutes"
          } ran`}
          periodType={periodType}
          previousValue={
            previousPeriod
              ? previousPeriod.runSeconds /
                (currentPeriod.runSeconds >= TIME.secondsPerHour
                  ? TIME.secondsPerHour
                  : TIME.secondsPerMinute)
              : undefined
          }
        />
      )}
      {Boolean(
        previousPeriod
          ? currentPeriod.totalPushUps || previousPeriod.totalPushUps
          : currentPeriod.totalPushUps,
      ) && (
        <MoodSummaryItem
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
        <MoodSummaryItem
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
        <MoodSummaryItem
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
