import { Paper } from "eri";
import { useSelector } from "react-redux";
import {
  normalizedMeditationsSelector,
  normalizedMoodsSelector,
} from "../../../selectors";
import {
  computeStandardDeviation,
  formatIsoDateInLocalTimezone,
  computeSecondsMeditatedInInterval,
  computeMeanSafe,
} from "../../../utils";
import useMoodsInPeriod from "../../hooks/useMoodsInPeriod";
import useWeightsInPeriod from "../../hooks/useWeightsInPeriod";
import MoodSummary from "../../shared/MoodSummary";

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
  const meditations = useSelector(normalizedMeditationsSelector);
  const moods = useSelector(normalizedMoodsSelector);
  const weightsInPeriod = useWeightsInPeriod(date1, date2).map(
    ({ value }) => value
  );
  const weightsInPreviousPeriod = useWeightsInPeriod(date0, date1).map(
    ({ value }) => value
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
            date2
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
                  date1
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
