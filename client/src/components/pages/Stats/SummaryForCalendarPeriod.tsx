import {
  computeCompletePopulationStandardDeviation,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import { Paper } from "eri";
import { ReactNode } from "react";
import { RootState } from "../../../store";
import Summary from "../../shared/Summary";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

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
  const denormalizedMoodsOrderedByExperiencedAt = useSelector(
    eventsSlice.selectors.denormalizedMoodsOrderedByExperiencedAt,
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

  const firstMoodDate = new Date(
    denormalizedMoodsOrderedByExperiencedAt[0].experiencedAt,
  );
  const showPrevious = date1 > firstMoodDate;

  const moodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date1, date2),
  ).map(({ mood }) => mood);
  const prevMoodValues = useSelector((state: RootState) =>
    eventsSlice.selectors.moodsInPeriod(state, date0, date1),
  ).map(({ mood }) => mood);

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
          totalLegRaises: totalLegRaisesInCurrentPeriod,
          totalPushUps: totalPushUpsInCurrentPeriod,
          totalSitUps: totalSitUpsInCurrentPeriod,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
        periodType={periodType}
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
