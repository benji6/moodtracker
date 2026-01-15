import {
  computeCompletePopulationMssd,
  computeCompletePopulationStandardDeviation,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import { Paper } from "eri";
import { ReactNode, useMemo } from "react";
import { RootState } from "../../../store";
import Summary from "../../shared/Summary";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";
import { subDays, subWeeks, subMonths, subYears } from "date-fns";

const periodSubtractors = {
  day: subDays,
  week: subWeeks,
  month: subMonths,
  year: subYears,
} as const;

const computePeriodsSinceLastHighOrLow = (
  meanMoodByDate: Record<string, number | undefined>,
  currentDate: Date,
  periodType: "day" | "week" | "month" | "year",
): { isBest: boolean; count: number; isAllTime: boolean } | undefined => {
  const subtract = periodSubtractors[periodType];
  const currentDateKey = formatIsoDateInLocalTimezone(currentDate);
  const currentMood = meanMoodByDate[currentDateKey];
  if (currentMood === undefined) return undefined;

  const previousDateKey = formatIsoDateInLocalTimezone(
    subtract(currentDate, 1),
  );
  const previousMood = meanMoodByDate[previousDateKey];
  if (previousMood === undefined) return undefined;

  const isBest = currentMood > previousMood;

  let count = 1;
  let checkDate = subtract(currentDate, 1);
  let isAllTime = true;

  while (true) {
    const checkDateKey = formatIsoDateInLocalTimezone(checkDate);
    const checkMood = meanMoodByDate[checkDateKey];
    if (checkMood === undefined) break;

    if (isBest) {
      if (checkMood > currentMood) {
        isAllTime = false;
        break;
      }
    } else {
      if (checkMood < currentMood) {
        isAllTime = false;
        break;
      }
    }

    count++;
    checkDate = subtract(checkDate, 1);
  }

  if (isAllTime) {
    for (const [key, val] of Object.entries(meanMoodByDate)) {
      if (key === currentDateKey) continue;
      if (val === undefined) continue;
      if (isBest) {
        if (val > currentMood) {
          isAllTime = false;
          break;
        }
      } else {
        if (val < currentMood) {
          isAllTime = false;
          break;
        }
      }
    }
  }

  return { isBest, count, isAllTime };
};

interface Props {
  dates: [Date, Date, Date];
  heading?: ReactNode;
  meanMoodByDate: Record<string, number | undefined>;
  periodType: "day" | "month" | "week" | "year";
}

export default function SummaryForCalendarPeriod({
  dates: [date0, date1, date2],
  heading = "Summary",
  meanMoodByDate,
  periodType,
}: Props) {
  const firstEventExperiencedAt = useSelector(
    eventsSlice.selectors.firstEventExperiencedAt,
  );
  const meanSleepInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanDailySleepDurationInPeriod(state, date1, date2),
  );
  const meanSleepInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanDailySleepDurationInPeriod(state, date0, date1),
  );
  const meanWeightInPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, date1, date2),
  );
  const meanWeightInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.meanWeightInPeriod(state, date0, date1),
  );
  const runMetersInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.runMetersInPeriod(state, date1, date2),
  );
  const runMetersInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.runMetersInPeriod(state, date0, date1),
  );
  const runSecondsInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.runSecondsInPeriod(state, date1, date2),
  );
  const runSecondsInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.runSecondsInPeriod(state, date0, date1),
  );
  const secondsMeditatedInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date1, date2),
  );
  const secondsMeditatedInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date0, date1),
  );
  const totalLegRaisesInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalLegRaisesInPeriod(state, date1, date2),
  );
  const totalLegRaisesInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalLegRaisesInPeriod(state, date0, date1),
  );
  const totalPushUpsInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, date1, date2),
  );
  const totalPushUpsInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, date0, date1),
  );
  const totalSitUpsInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalSitUpsInPeriod(state, date1, date2),
  );
  const totalSitUpsInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalSitUpsInPeriod(state, date0, date1),
  );
  const moodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date1, date2),
  ).map(({ mood }) => mood);
  const prevMoodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date0, date1),
  ).map(({ mood }) => mood);

  const periodsSinceLastHighOrLow = useMemo(
    () => computePeriodsSinceLastHighOrLow(meanMoodByDate, date1, periodType),
    [meanMoodByDate, date1, periodType],
  );

  if (!firstEventExperiencedAt) return;

  const firstMoodDate = new Date(firstEventExperiencedAt);
  const showPrevious = date1 > firstMoodDate;

  if (
    !moodValues.length &&
    !prevMoodValues.length &&
    meanSleepInPeriod === undefined &&
    meanSleepInPreviousPeriod === undefined &&
    meanWeightInPeriod === undefined &&
    meanWeightInPreviousPeriod === undefined &&
    !secondsMeditatedInCurrentPeriod &&
    !secondsMeditatedInPreviousPeriod
  )
    return;

  return (
    <Paper>
      <h3>{heading}</h3>
      <Summary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: meanMoodByDate[formatIsoDateInLocalTimezone(date1)],
          runMeters: runMetersInCurrentPeriod,
          runSeconds: runSecondsInCurrentPeriod,
          meanSleep: meanSleepInPeriod,
          meanWeight: meanWeightInPeriod,
          secondsMeditated: secondsMeditatedInCurrentPeriod,
          standardDeviation:
            computeCompletePopulationStandardDeviation(moodValues),
          mssd: computeCompletePopulationMssd(moodValues),
          totalLegRaises: totalLegRaisesInCurrentPeriod,
          totalPushUps: totalPushUpsInCurrentPeriod,
          totalSitUps: totalSitUpsInCurrentPeriod,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
        periodType={periodType}
        periodsSinceLastHighOrLow={periodsSinceLastHighOrLow}
        previousPeriod={
          showPrevious
            ? {
                best: prevMoodValues.length
                  ? Math.max(...prevMoodValues)
                  : undefined,
                mean: meanMoodByDate[formatIsoDateInLocalTimezone(date0)],
                meanSleep: meanSleepInPreviousPeriod,
                meanWeight: meanWeightInPreviousPeriod,
                runMeters: runMetersInPreviousPeriod,
                runSeconds: runSecondsInPreviousPeriod,
                secondsMeditated: secondsMeditatedInPreviousPeriod,
                standardDeviation:
                  computeCompletePopulationStandardDeviation(prevMoodValues),
                mssd: computeCompletePopulationMssd(prevMoodValues),
                totalLegRaises: totalLegRaisesInPreviousPeriod,
                totalPushUps: totalPushUpsInPreviousPeriod,
                totalSitUps: totalSitUpsInPreviousPeriod,
                worst: prevMoodValues.length
                  ? Math.min(...prevMoodValues)
                  : undefined,
              }
            : undefined
        }
      />
    </Paper>
  );
}
