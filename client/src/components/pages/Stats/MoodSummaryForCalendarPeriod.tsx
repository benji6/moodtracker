import {
  computeMeanSafe,
  computeSecondsMeditatedInInterval,
  computeStandardDeviation,
  formatIsoDateInLocalTimezone,
} from "../../../utils";
import MoodSummary from "../../shared/MoodSummary";
import { Paper } from "eri";
import eventsSlice from "../../../store/eventsSlice";
import useMoodsInPeriod from "../../hooks/useMoodsInPeriod";
import { useSelector } from "react-redux";
import useWeightsInPeriod from "../../hooks/useWeightsInPeriod";

interface Props {
  dates: [Date, Date, Date];
  normalizedAverages: {
    allIds: string[];
    byId: {
      [k: string]: number | undefined;
    };
  };
  periodType: "day" | "month" | "week" | "year";
}

export default function MoodSummaryForCalendarPeriod({
  dates: [date0, date1, date2],
  normalizedAverages,
  periodType,
}: Props) {
  const meditations = useSelector(eventsSlice.selectors.normalizedMeditations);
  const moods = useSelector(eventsSlice.selectors.normalizedMoods);
  const weightsInPeriod = useWeightsInPeriod(date1, date2).map(
    ({ value }) => value,
  );
  const weightsInPreviousPeriod = useWeightsInPeriod(date0, date1).map(
    ({ value }) => value,
  );

  const firstMoodDate = new Date(moods.allIds[0]);
  const showPrevious = date1 > firstMoodDate;

  const moodValues = useMoodsInPeriod(date1, date2).map(({ mood }) => mood);
  const prevMoodValues = useMoodsInPeriod(date0, date1).map(({ mood }) => mood);

  return (
    <Paper>
      <h3>Summary</h3>
      <MoodSummary
        currentPeriod={{
          best: moodValues.length ? Math.max(...moodValues) : undefined,
          mean: normalizedAverages.byId[formatIsoDateInLocalTimezone(date1)],
          meanWeight: computeMeanSafe(weightsInPeriod),
          secondsMeditated: computeSecondsMeditatedInInterval(
            meditations,
            date1,
            date2,
          ),
          standardDeviation: computeStandardDeviation(moodValues),
          total: moodValues.length,
          worst: moodValues.length ? Math.min(...moodValues) : undefined,
        }}
        periodType={periodType}
        previousPeriod={
          showPrevious
            ? {
                best: prevMoodValues.length
                  ? Math.max(...prevMoodValues)
                  : undefined,
                mean: normalizedAverages.byId[
                  formatIsoDateInLocalTimezone(date0)
                ],
                meanWeight: computeMeanSafe(weightsInPreviousPeriod),
                secondsMeditated: computeSecondsMeditatedInInterval(
                  meditations,
                  date0,
                  date1,
                ),
                standardDeviation: computeStandardDeviation(prevMoodValues),
                total: prevMoodValues.length,
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
