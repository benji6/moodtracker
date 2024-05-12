import {
  computeCompletePopulationStandardDeviation,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import MoodSummary from "../../shared/MoodSummary";
import { Paper } from "eri";
import { ReactNode } from "react";
import { RootState } from "../../../store";
import eventsSlice from "../../../store/eventsSlice";
import { useSelector } from "react-redux";

interface Props {
  dates: [Date, Date, Date];
  heading?: ReactNode;
  meanMoodByDate: {
    [date: string]: number | undefined;
  };
  periodType: "day" | "month" | "week" | "year";
}

export default function MoodSummaryForCalendarPeriod({
  dates: [date0, date1, date2],
  heading = "Summary",
  meanMoodByDate,
  periodType,
}: Props) {
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
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
  const secondsMeditatedInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date1, date2),
  );
  const secondsMeditatedInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.secondsMeditatedInPeriod(state, date0, date1),
  );
  const totalPushUpsInCurrentPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, date1, date2),
  );
  const totalPushUpsInPreviousPeriod = useSelector((state: RootState) =>
    eventsSlice.selectors.totalPushUpsInPeriod(state, date0, date1),
  );

  const firstMoodDate = new Date(moods.allIds[0]);
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
    return null;

  return (
    <Paper>
      <h3>{heading}</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: meanMoodByDate[formatIsoDateInLocalTimezone(date1)],
          meanSleep: meanSleepInPeriod,
          meanWeight: meanWeightInPeriod,
          secondsMeditated: secondsMeditatedInCurrentPeriod,
          standardDeviation:
            computeCompletePopulationStandardDeviation(moodValues),
          total: moodValues.length,
          totalPushUps: totalPushUpsInCurrentPeriod,
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
                secondsMeditated: secondsMeditatedInPreviousPeriod,
                standardDeviation:
                  computeCompletePopulationStandardDeviation(prevMoodValues),
                total: prevMoodValues.length,
                totalPushUps: totalPushUpsInPreviousPeriod,
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
